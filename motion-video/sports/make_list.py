#!/usr/bin/env python3
"""Write sports/SPORTS.md, the readable list of every sport in sports.json.

    python3 sports/make_list.py

Run it again after changing sports.json (a new sport, or one that has
come to Kurdistan), so the list stays in step with the films.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    data = json.load(open(os.path.join(HERE, 'sports.json')))
    sports = data['sports']
    here = sum(s['kurdistan'] for s in sports)
    out = [
        '# هەموو وەرزشەکانی جیهان',
        '',
        f'{len(sports)} وەرزش لە {len(data["categories"])} بەشدا. '
        f'✅ لە کوردستان هەیە ({here}) · 🔜 لە داهاتوودا دێت ({len(sports) - here})',
        '',
        'ئەم نیشانانە نزیکەیین؛ بۆ گۆڕینیان `"kurdistan"` لە `sports.json` بگۆڕە و '
        '`python3 sports/make_list.py` لێبدەرەوە. کۆدی هەر وەرزشێک (وەک `football`) '
        'ئەوەیە کە بۆ دروستکردنی ڤیدیۆکەی بەکاردێت.',
        '',
    ]
    for i, cat in enumerate(data['categories'], start=1):
        items = [s for s in sports if s['cat'] == cat['id']]
        out += [f'## {i}. {cat["ku"]} ({cat["en"]})', '']
        for s in sorted(items, key=lambda s: not s['kurdistan']):
            mark = '✅' if s['kurdistan'] else '🔜'
            out.append(f'- {mark} {s["ku"]} · {s["en"].title()} · `{s["id"]}`')
        out.append('')
    with open(os.path.join(HERE, 'SPORTS.md'), 'w') as f:
        f.write('\n'.join(out))
    print(f'wrote sports/SPORTS.md: {len(sports)} sports, {here} in Kurdistan')


if __name__ == '__main__':
    main()
