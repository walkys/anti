import urllib.request
import re

def inspect_board(url, board_name):
    print(f"=== Inspecting {board_name} ===")
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
        
        # Save html to scratch for safe keeping
        with open(f"scratch/live_{board_name}.html", "w", encoding="utf-8") as f:
            f.write(html)
            
        print("Downloaded successfully.")
        
        # Find where boardSort, board_list, notice, gallery_list are
        for m in re.finditer(r'class="gallery_list"', html):
            pos = m.start()
            print(f"Found gallery_list at position {pos}:")
            print(html[pos:pos+1500])
            print("-" * 50)
            
    except Exception as e:
        print(f"Error: {e}")

inspect_board("https://machuda.cafe24.com/skin-skin110/board/gallery/list.html?board_no=2", "board_2")
inspect_board("https://machuda.cafe24.com/skin-skin110/board/gallery/list.html?board_no=4", "board_4")
