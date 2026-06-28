import urllib.request

def download_file(url, out_path):
    print(f"Downloading {url}...")
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            content = res.read()
        with open(out_path, "wb") as f:
            f.write(content)
        print(f"Downloaded: {len(content)} bytes to {out_path}")
    except Exception as e:
        print(f"Error: {e}")

download_file("https://www.machuda.com/web/upload/calculator/app.js?v=1.7", "scratch/live_app.js")
download_file("https://www.machuda.com/web/upload/calculator/style.css?v=1.7", "scratch/live_style.css")
