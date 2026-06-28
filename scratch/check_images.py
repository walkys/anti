from html.parser import HTMLParser

class ImageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
        self.inside_raw = False
        self.in_wrap = False
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == 'div' and attrs_dict.get('id') == 'machuda-raw-board-wrap':
            self.inside_raw = True
            
        if self.inside_raw:
            if tag == 'img':
                self.images.append(attrs_dict)

    def handle_endtag(self, tag):
        # We don't necessarily need to end parsing if we just want all images under this container
        pass

def inspect_images(filepath, name):
    print(f"=== Images in {name} ===")
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    
    parser = ImageParser()
    parser.feed(html)
    
    print(f"Found {len(parser.images)} images in raw container")
    for idx, img in enumerate(parser.images[:5]):
        print(f"  Image {idx+1}: {img}")
    print("-" * 50)

inspect_images("scratch/live_board_2.html", "Board 2")
inspect_images("scratch/live_board_4.html", "Board 4")
