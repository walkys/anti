with open("scratch/live_board_4.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
matches = [m.start() for m in re.finditer("machuda-portfolio", html)]
for pos in matches:
    print(html[pos-100:pos+200])
    print("-" * 50)
