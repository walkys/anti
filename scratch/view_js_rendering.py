with open("machuda-portfolio.js", "r", encoding="utf-8") as f:
    js = f.read()

import re
pos = js.find('const maxVisible =')
if pos != -1:
    print(js[pos:pos+2000])
else:
    print("Could not find const maxVisible")
