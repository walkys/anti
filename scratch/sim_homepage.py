"""
홈페이지 tr.machuda-raw-row 파싱 시뮬레이션
"""
from html.parser import HTMLParser
import re

with open("scratch/live_homepage.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find all tr.machuda-raw-row elements and parse their data
pattern = r'<tr class="machuda-raw-row"([^>]*)>(.*?)</tr>'
matches = re.findall(pattern, html, re.DOTALL)

print(f"=== 홈페이지 tr.machuda-raw-row 파싱 결과 ===")
print(f"총 행 수: {len(matches)}\n")

cards = []
for i, (attrs, content) in enumerate(matches):
    subject = re.search(r'data-subject="([^"]*)"', attrs)
    category = re.search(r'data-category="([^"]*)"', attrs)
    image = re.search(r'data-image="([^"]*)"', attrs)
    
    s = subject.group(1) if subject else '없음'
    c = category.group(1) if category else '없음'
    img = image.group(1) if image else '없음'
    
    cards.append({'subject': s, 'category': c, 'image': img})
    
    if i < 5:
        print(f"카드 {i+1}:")
        print(f"  제목: {s}")
        print(f"  카테고리: {c}")
        print(f"  이미지: {img[:60]}...")
        print()

print(f"✅ 총 {len(cards)}개 카드 파싱 가능")
print(f"\n홈페이지에 표시될 카드 (최대 5개):")
for card in cards[:5]:
    cat = card['category']
    catkey = 'company' if '회사' in cat or '근무' in cat else \
             'school' if '학교' in cat or '반티' in cat or '과' in cat or '대학' in cat else \
             'church' if '교회' in cat or '종교' in cat or '가족' in cat else \
             'sports' if '동호' in cat or '굿즈' in cat else 'sauna'
    print(f"  [{catkey}] {card['subject'][:40]}")
