import re

with open("scratch/live_board_4.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find the Cafe24 gallery CSS inclusion
print("=== Cafe24 갤러리 관련 CSS/Style 확인 ===")
# Find listPackage_gallary.css link
matches = [m.start() for m in re.finditer(r'listPackage_gallary', html)]
for pos in matches:
    print(html[max(0, pos-50):pos+200])
    print("-"*50)

# Find inline styles for xans-board-list
matches2 = [m.start() for m in re.finditer(r'xans-board-list-8', html)]
print(f"\nFound xans-board-list-8 {len(matches2)} times")

# Check if there's display inline-block for gallery items
matches3 = [m.start() for m in re.finditer(r'inline-block', html)]
print(f"\nFound 'inline-block' {len(matches3)} times in page")
if matches3:
    for pos in matches3[:3]:
        print(html[max(0, pos-100):pos+100])
        print("-"*30)
