/* کۆدی لاپەڕە گشتییەکان: پێشاندانی وێنە بە گەورەیی و کۆپیکردنی بەستەر */
(function(){
  "use strict";

  /* ---------- پێشاندانی وێنە ---------- */
  var box = document.getElementById("lightbox");
  var items = [].slice.call(document.querySelectorAll(".gal-item"));
  var index = 0;

  if(box && items.length){
    var img = box.querySelector("img");
    var multi = items.length > 1;

    function show(i){
      index = (i + items.length) % items.length;
      img.src = items[index].getAttribute("data-full");
      box.hidden = false;
      box.querySelector(".lb-prev").hidden = !multi;
      box.querySelector(".lb-next").hidden = !multi;
      document.body.style.overflow = "hidden";
    }
    function close(){
      box.hidden = true;
      img.removeAttribute("src");
      document.body.style.overflow = "";
      if(items[index]) items[index].focus();
    }

    items.forEach(function(el, i){
      el.addEventListener("click", function(){ show(i); });
    });
    box.querySelector(".lb-close").addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", function(){ show(index - 1); });
    box.querySelector(".lb-next").addEventListener("click", function(){ show(index + 1); });
    box.addEventListener("click", function(e){ if(e.target === box) close(); });
    document.addEventListener("keydown", function(e){
      if(box.hidden) return;
      if(e.key === "Escape") close();
      else if(e.key === "ArrowRight") show(index - 1);
      else if(e.key === "ArrowLeft") show(index + 1);
    });

    // ڕاکێشانی پەنجە لەسەر مۆبایل
    var startX = null;
    box.addEventListener("touchstart", function(e){ startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function(e){
      if(startX === null || !multi) return;
      var dx = e.changedTouches[0].clientX - startX;
      if(Math.abs(dx) > 50) show(index + (dx > 0 ? 1 : -1));
      startX = null;
    });
  }

  /* ---------- شریتی سەرەوە و دوگمەی گەڕانەوە بۆ سەرەوە ---------- */
  var topbar = document.getElementById("topbar");
  var toTop = document.getElementById("toTop");
  function onScroll(){
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if(topbar) topbar.classList.toggle("is-solid", y > 60);
    if(toTop) toTop.classList.toggle("show", y > 900);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if(toTop) toTop.addEventListener("click", function(){ window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- کۆپیکردنی بەستەر ---------- */
  var toast = document.getElementById("toast");
  function say(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(say.t);
    say.t = setTimeout(function(){ toast.classList.remove("show"); }, 2200);
  }

  [].forEach.call(document.querySelectorAll("[data-copy]"), function(btn){
    btn.addEventListener("click", function(){
      var text = btn.getAttribute("data-copy");
      if(navigator.share && /Mobi|Android|iPhone/i.test(navigator.userAgent)){
        navigator.share({ title: document.title, url: text }).catch(function(){});
        return;
      }
      if(navigator.clipboard){
        navigator.clipboard.writeText(text).then(function(){ say("بەستەرەکە کۆپی کرا"); },
                                                  function(){ say(text); });
      } else {
        say(text);
      }
    });
  });
})();
