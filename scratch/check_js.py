with open("machuda-portfolio.js", "r", encoding="utf-8") as f:
    js = f.read()

import re
pos = js.find('const isValidPortfolioImage =')
if pos != -1:
    print(js[pos:pos+2500])
else:
    print("Could not find isValidPortfolioImage")
