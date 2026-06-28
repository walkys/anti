with open("machuda-portfolio.css", "r", encoding="utf-8") as f:
    css = f.read()

import re
pos = css.find('.machuda-portfolio-grid')
if pos != -1:
    print(css[pos:pos+2000])
else:
    print("Could not find .machuda-portfolio-grid")
