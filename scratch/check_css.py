with open("machuda-portfolio.css", "r", encoding="utf-8") as f:
    css = f.read()

import re
# Find rules for gallery_list, raw-board, raw-data, active portfolio, etc.
lines = css.split('\n')
print("=== CSS Lines count ===", len(lines))

# Print sections that contain gallery_list or machuda-portfolio-active
print("=== CSS active styles ===")
pos = css.find('.machuda-portfolio-active')
if pos != -1:
    print(css[pos:pos+1500])
else:
    print("Could not find .machuda-portfolio-active")

print("\n=== CSS gallery_list styles ===")
pos2 = css.find('gallery_list')
if pos2 != -1:
    print(css[pos2-100:pos2+1000])
else:
    print("Could not find gallery_list")
