import re

with open("scratch/live_board_4.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find what CSS files are loaded in the page
css_links = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]*>', html)
print("=== 로드되는 CSS 파일들 ===")
for link in css_links:
    print(link)
    
print("\n=== 갤러리 영역 구조 (machuda-raw-data-table) ===")
pos = html.find('machuda-raw-data-table')
if pos != -1:
    # Print to next div closure
    section = html[pos:pos+200]
    print(section)
    
print("\n=== 갤러리 div 스타일 확인 ===")
# Find all div.gallery_list.xans-record- and their parent structures
matches = list(re.finditer(r'<div class="xans-element- xans-board xans-board-list-8.*?gallery_list xans-record-"', html))
print(f"div.gallery_list 반복 횟수: {len(matches)}")
if matches:
    # Find the parent context of first match
    pos = matches[0].start()
    print(f"\n첫번째 div.gallery_list 전후 100자:")
    print(html[max(0, pos-100):pos+300])
