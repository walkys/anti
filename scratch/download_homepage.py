import urllib.request
import re

url = "https://www.machuda.com/"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
)

try:
    with urllib.request.urlopen(req, timeout=15) as res:
        html = res.read().decode('utf-8', errors='replace')
    with open("scratch/live_homepage.html", "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Downloaded: {len(html)} bytes")
    
    # Let's search for script tags containing app.js, machuda-portfolio.js, style.css, etc.
    print("=== Searching for app.js references ===")
    for line in html.splitlines():
        if "app.js" in line or "calculator" in line or "machuda" in line or "style.css" in line:
            print(line.strip())
            
except Exception as e:
    print(f"Error: {e}")
