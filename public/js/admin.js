/* کۆدی کۆنترۆڵ پانێڵ */
(function(){
  "use strict";

  var $ = function(id){ return document.getElementById(id); };
  var posts = [];
  var settings = {};
  var editingId = null;
  var images = [];        // [{ value: ناوی فایل یان dataURL, src: بۆ پێشاندان }]
  var pendingImg = { logo: undefined, banner: undefined };

  /* ---------- هاوکارەکان ---------- */
  function api(method, url, data){
    return fetch(url, {
      method: method,
      credentials: "same-origin",
      headers: data !== undefined ? { "Content-Type": "application/json" } : {},
      body: data !== undefined ? JSON.stringify(data) : undefined
    }).then(function(res){
      return res.json().catch(function(){ return {}; }).then(function(body){
        if(res.status === 401 && url.indexOf("/api/admin/") === 0) showLogin();
        if(!res.ok) throw new Error(body.error || ("هەڵە: " + res.status));
        return body;
      });
    });
  }

  function toast(msg){
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function(){ t.classList.remove("show"); }, 2600);
  }

  function esc(s){
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function uploadUrl(v){ return /^data:/.test(v) ? v : "/uploads/" + encodeURIComponent(v); }
  function today(){
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  /* وێنە پێش ناردن بچووک دەکرێتەوە — وێنەی مۆبایل زۆر گەورەن */
  function prepareImage(file, maxSide, type){
    return new Promise(function(resolve, reject){
      if(!/^image\//.test(file.type)) return reject(new Error("ئەم فایلە وێنە نییە: " + file.name));
      if(file.type === "image/gif"){
        if(file.size > 8 * 1024 * 1024) return reject(new Error("GIF ـەکە زۆر گەورەیە"));
        var fr = new FileReader();
        fr.onload = function(){ resolve(fr.result); };
        fr.onerror = function(){ reject(new Error("خوێندنەوەی فایل سەرکەوتوو نەبوو")); };
        return fr.readAsDataURL(file);
      }
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function(){
        var scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
        var w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
        var c = document.createElement("canvas");
        c.width = w; c.height = h;
        var ctx = c.getContext("2d");
        if(type === "image/jpeg"){ ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h); }
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL(type, 0.86));
      };
      img.onerror = function(){ URL.revokeObjectURL(url); reject(new Error("وێنەکە ناخوێندرێتەوە: " + file.name)); };
      img.src = url;
    });
  }

  /* ---------- چوونەژوورەوە ---------- */
  function showLogin(){
    $("appView").hidden = true;
    $("loginView").hidden = false;
    setTimeout(function(){ $("code").focus(); }, 50);
  }

  function showApp(){
    $("loginView").hidden = true;
    $("appView").hidden = false;
    Promise.all([api("GET", "/api/admin/posts"), api("GET", "/api/admin/settings")]).then(function(r){
      posts = r[0].posts;
      settings = r[1].settings;
      $("envNote").hidden = !r[1].envCode;
      fillCategories();
      renderList();
      fillSettings();
      route();
    }).catch(function(e){ toast(e.message); });
  }

  $("loginForm").addEventListener("submit", function(e){
    e.preventDefault();
    $("loginError").textContent = "";
    var btn = e.submitter || this.querySelector("button");
    btn.disabled = true;
    api("POST", "/api/login", { code: $("code").value }).then(function(){
      $("code").value = "";
      showApp();
    }).catch(function(err){
      $("loginError").textContent = err.message;
    }).then(function(){ btn.disabled = false; });
  });

  $("logoutBtn").addEventListener("click", function(e){
    e.preventDefault();
    api("POST", "/api/logout", {}).then(showLogin);
  });

  /* ---------- تابەکان ---------- */
  function route(){
    var h = location.hash.replace("#", "");
    var tab = h === "posts" ? "posts" : h === "settings" ? "settings" : "editor";
    ["editor", "posts", "settings"].forEach(function(t){ $("tab-" + t).hidden = t !== tab; });
    [].forEach.call(document.querySelectorAll("[data-tab]"), function(a){
      a.classList.toggle("is-on", a.getAttribute("data-tab") === tab);
    });
    if(h === "new" && editingId) resetEditor();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  /* ---------- دانانی بابەت ---------- */
  function fillCategories(current){
    var sel = $("pCategory");
    var cats = (settings.categories || []).slice();
    if(current && cats.indexOf(current) < 0) cats.push(current);
    sel.innerHTML = '<option value="">— بێ بەش —</option>' + cats.map(function(c){
      return '<option>' + esc(c) + '</option>';
    }).join("");
    sel.value = current !== undefined ? current : (cats[0] || "");
  }

  function renderThumbs(){
    var box = $("thumbs");
    box.innerHTML = images.map(function(img, i){
      return '<div class="thumb' + (i === 0 ? " is-cover" : "") + (img.loading ? " is-loading" : "") + '">' +
        (img.src ? '<img src="' + esc(img.src) + '" alt="">' : "") +
        (i === 0 ? '<span class="badge">سەرەکی</span>' : "") +
        '<div class="tools">' +
          (i > 0 ? '<button type="button" data-act="cover" data-i="' + i + '" title="بیکە بە سەرەکی">★</button>' : "") +
          (i > 0 ? '<button type="button" data-act="up" data-i="' + i + '" title="بۆ پێشەوە">→</button>' : "") +
          (i < images.length - 1 ? '<button type="button" data-act="down" data-i="' + i + '" title="بۆ دواوە">←</button>' : "") +
          '<button type="button" class="del" data-act="del" data-i="' + i + '" title="لابردن">×</button>' +
        '</div></div>';
    }).join("");
  }

  $("thumbs").addEventListener("click", function(e){
    var b = e.target.closest("button[data-act]");
    if(!b) return;
    var i = +b.getAttribute("data-i"), act = b.getAttribute("data-act");
    if(act === "del") images.splice(i, 1);
    else if(act === "cover") images.unshift(images.splice(i, 1)[0]);
    else if(act === "up"){ var a = images[i - 1]; images[i - 1] = images[i]; images[i] = a; }
    else if(act === "down"){ var d = images[i + 1]; images[i + 1] = images[i]; images[i] = d; }
    renderThumbs();
  });

  function addFiles(files){
    [].forEach.call(files, function(file){
      var slot = { loading: true, src: "", value: "" };
      images.push(slot);
      renderThumbs();
      prepareImage(file, 1920, "image/jpeg").then(function(data){
        slot.value = data; slot.src = data; slot.loading = false;
      }).catch(function(err){
        images.splice(images.indexOf(slot), 1);
        toast(err.message);
      }).then(renderThumbs);
    });
  }

  var dz = $("dropzone");
  dz.addEventListener("click", function(){ $("pFiles").click(); });
  dz.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); $("pFiles").click(); } });
  $("pFiles").addEventListener("change", function(){ addFiles(this.files); this.value = ""; });
  ["dragenter", "dragover"].forEach(function(ev){
    dz.addEventListener(ev, function(e){ e.preventDefault(); dz.classList.add("is-over"); });
  });
  ["dragleave", "drop"].forEach(function(ev){
    dz.addEventListener(ev, function(e){ e.preventDefault(); dz.classList.remove("is-over"); });
  });
  dz.addEventListener("drop", function(e){ addFiles(e.dataTransfer.files); });

  function resetEditor(){
    editingId = null;
    images = [];
    $("postForm").reset();
    $("pDate").value = today();
    $("pPublished").checked = true;
    fillCategories();
    renderThumbs();
    $("postError").textContent = "";
    $("editorTitle").innerHTML = 'بابەتی نوێ<span>وێنە و نووسین دابنێ و بڵاوی بکەرەوە</span>';
    $("saveBtn").textContent = "بڵاوکردنەوە";
    $("cancelEdit").hidden = true;
  }

  function editPost(id){
    var p = posts.find(function(x){ return x.id === id; });
    if(!p) return;
    editingId = id;
    $("pTitle").value = p.title;
    fillCategories(p.category || "");
    $("pDate").value = p.date || today();
    $("pBody").value = p.body || "";
    $("pPublished").checked = p.published !== false;
    $("pFeatured").checked = !!p.featured;
    images = (p.images || []).map(function(n){ return { value: n, src: uploadUrl(n) }; });
    renderThumbs();
    $("postError").textContent = "";
    $("editorTitle").innerHTML = 'دەستکاریکردنی بابەت<span>' + esc(p.title) + '</span>';
    $("saveBtn").textContent = "پاشەکەوتکردنی گۆڕانکاری";
    $("cancelEdit").hidden = false;
    history.replaceState(null, "", "#edit");
    ["editor", "posts", "settings"].forEach(function(t){ $("tab-" + t).hidden = t !== "editor"; });
    window.scrollTo(0, 0);
  }

  $("cancelEdit").addEventListener("click", function(){
    resetEditor();
    location.hash = "posts";
  });

  $("postForm").addEventListener("submit", function(e){
    e.preventDefault();
    $("postError").textContent = "";
    if(images.some(function(i){ return i.loading; })){
      $("postError").textContent = "چاوەڕێ بکە تا وێنەکان ئامادە دەبن...";
      return;
    }
    var data = {
      title: $("pTitle").value,
      category: $("pCategory").value,
      date: $("pDate").value,
      body: $("pBody").value,
      published: $("pPublished").checked,
      featured: $("pFeatured").checked,
      images: images.map(function(i){ return i.value; })
    };
    var btn = $("saveBtn");
    btn.disabled = true;
    var old = btn.textContent;
    btn.textContent = "چاوەڕێ بکە...";
    var req = editingId ? api("PUT", "/api/admin/posts/" + editingId, data) : api("POST", "/api/admin/posts", data);
    req.then(function(r){
      return api("GET", "/api/admin/posts").then(function(list){
        posts = list.posts;
        renderList();
        toast(editingId ? "گۆڕانکارییەکان پاشەکەوت کران" : "بابەتەکە بڵاوکرایەوە");
        resetEditor();
        location.hash = "posts";
        return r;
      });
    }).catch(function(err){
      $("postError").textContent = err.message;
    }).then(function(){ btn.disabled = false; if(btn.textContent === "چاوەڕێ بکە...") btn.textContent = old; });
  });

  /* ---------- لیستی بابەتەکان ---------- */
  function renderList(){
    var q = ($("postFilter").value || "").trim().toLowerCase();
    var list = posts.filter(function(p){ return !q || (p.title + " " + p.category).toLowerCase().indexOf(q) >= 0; });
    $("postTotal").textContent = posts.length;
    $("postList").innerHTML = list.length ? list.map(function(p){
      var cover = p.images && p.images[0];
      return '<div class="post-row">' +
        '<img src="' + (cover ? uploadUrl(cover) : "/img/logo.svg") + '" alt="" loading="lazy">' +
        '<div><h3>' + esc(p.title) + '</h3><div class="meta">' +
          '<span>' + esc(p.date) + '</span>' +
          (p.category ? '<span class="tag">' + esc(p.category) + '</span>' : "") +
          (p.published === false ? '<span class="tag draft">ڕەشنووس</span>' : "") +
          (p.featured ? '<span class="tag star">سەرەکی</span>' : "") +
          '<span>' + (p.images ? p.images.length : 0) + ' وێنە</span>' +
        '</div></div>' +
        '<div class="row-actions">' +
          '<a class="btn-2 btn btn-sm" href="/post/' + esc(p.id) + '" target="_blank">بینین</a>' +
          '<button type="button" class="btn-2 btn btn-sm" data-edit="' + esc(p.id) + '">دەستکاری</button>' +
          '<button type="button" class="btn-2 btn btn-sm btn-danger" data-del="' + esc(p.id) + '">سڕینەوە</button>' +
        '</div></div>';
    }).join("") : '<div class="empty">' + (q ? "هیچ بابەتێک نەدۆزرایەوە." : "هێشتا هیچ بابەتێک نییە. یەکەمیان دابنێ!") + '</div>';
  }

  $("postFilter").addEventListener("input", renderList);
  $("postList").addEventListener("click", function(e){
    var ed = e.target.closest("[data-edit]");
    if(ed) return editPost(ed.getAttribute("data-edit"));
    var del = e.target.closest("[data-del]");
    if(!del) return;
    var id = del.getAttribute("data-del");
    var p = posts.find(function(x){ return x.id === id; });
    if(!p || !confirm("دڵنیایت لە سڕینەوەی «" + p.title + "»؟ ئەمە ناگەڕێتەوە.")) return;
    api("DELETE", "/api/admin/posts/" + id).then(function(){
      posts = posts.filter(function(x){ return x.id !== id; });
      renderList();
      toast("بابەتەکە سڕایەوە");
    }).catch(function(err){ toast(err.message); });
  });

  /* ---------- ڕێکخستنەکان ---------- */
  var FIELDS = ["siteTitle", "shortTitle", "orgLatin", "tagline", "about", "phone", "email", "address",
                "facebook", "instagram", "youtube", "tiktok", "devName", "devMotto"];

  function previewImg(kind){
    var v = pendingImg[kind] !== undefined ? pendingImg[kind] : settings[kind];
    $(kind + "Prev").innerHTML = v ? '<img src="' + esc(uploadUrl(v)) + '" alt="">' : "<span>هیچ وێنەیەک نییە</span>";
  }

  function fillSettings(){
    FIELDS.forEach(function(k){ $("s_" + k).value = settings[k] || ""; });
    $("s_categories").value = (settings.categories || []).join("\n");
    pendingImg = { logo: undefined, banner: undefined };
    previewImg("logo");
    previewImg("banner");
    if(settings.logo) $("topLogo").src = uploadUrl(settings.logo);
  }

  [["logo", 512, "image/png"], ["banner", 2400, "image/jpeg"]].forEach(function(cfg){
    $(cfg[0] + "File").addEventListener("change", function(){
      var file = this.files[0];
      this.value = "";
      if(!file) return;
      prepareImage(file, cfg[1], cfg[2]).then(function(data){
        pendingImg[cfg[0]] = data;
        previewImg(cfg[0]);
      }).catch(function(err){ toast(err.message); });
    });
  });
  [].forEach.call(document.querySelectorAll("[data-clear]"), function(b){
    b.addEventListener("click", function(){
      var k = b.getAttribute("data-clear");
      pendingImg[k] = "";
      previewImg(k);
    });
  });

  $("settingsForm").addEventListener("submit", function(e){
    e.preventDefault();
    $("settingsError").textContent = "";
    var data = {};
    FIELDS.forEach(function(k){ data[k] = $("s_" + k).value; });
    data.categories = $("s_categories").value.split("\n");
    if(pendingImg.logo !== undefined) data.logo = pendingImg.logo;
    if(pendingImg.banner !== undefined) data.banner = pendingImg.banner;
    var btn = $("settingsSave");
    btn.disabled = true;
    api("PUT", "/api/admin/settings", data).then(function(r){
      settings = r.settings;
      fillSettings();
      fillCategories($("pCategory").value);
      toast("ڕێکخستنەکان پاشەکەوت کران");
    }).catch(function(err){
      $("settingsError").textContent = err.message;
    }).then(function(){ btn.disabled = false; });
  });

  $("codeForm").addEventListener("submit", function(e){
    e.preventDefault();
    $("codeError").textContent = "";
    api("PUT", "/api/admin/code", { current: $("cCurrent").value, next: $("cNext").value }).then(function(){
      $("codeForm").reset();
      toast("کۆدەکە گۆڕدرا");
    }).catch(function(err){ $("codeError").textContent = err.message; });
  });

  /* ---------- دەستپێکردن ---------- */
  $("pDate").value = today();
  api("GET", "/api/session").then(function(r){
    if(r.admin) showApp(); else showLogin();
  }).catch(showLogin);
})();
