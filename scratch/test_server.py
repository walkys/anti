import http.server
import socketserver
import os
import urllib.parse
import urllib.request

PORT = 8080
WORKSPACE_DIR = "/Users/walky/Documents/anti"

class MachudaTestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)
        
        # 1. Map CSS & JS
        if "machuda-portfolio.css" in path or "style.css" in path:
            self.send_response(200)
            self.send_header("Content-Type", "text/css; charset=utf-8")
            self.end_headers()
            with open(os.path.join(WORKSPACE_DIR, "style.css"), "rb") as f:
                self.wfile.write(f.read())
            return
            
        elif "machuda-portfolio.js" in path or "app.js" in path:
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript; charset=utf-8")
            self.end_headers()
            with open(os.path.join(WORKSPACE_DIR, "app.js"), "rb") as f:
                self.wfile.write(f.read())
            return
            
        # 2. Map board pages
        board_no = query.get("board_no", [""])[0]
        
        # Extract board no from path if query empty (e.g. /skin-skin110/article/photo-review/4/57760/)
        if not board_no:
            parts = path.split('/')
            for p in parts:
                if p == '4':
                    board_no = '4'
                    break
                elif p == '2':
                    board_no = '2'
                    break
                    
        # Check if pathname contains photo-review or gallery/list.html etc.
        if "board_no=4" in parsed_url.query or board_no == '4' or "photo-review" in path:
            # 포토후기(Board 4) 리스트 또는 상세
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            with open(os.path.join(WORKSPACE_DIR, "scratch", "live_board_4.html"), "rb") as f:
                content = f.read()
                # Inject a script to simulate dynamic document class injection
                # normally done by list.html or live JS
                script_inject = b"""
                <script>
                document.addEventListener("DOMContentLoaded", function() {
                    document.documentElement.classList.add('machuda-board-4');
                    console.log("Injected class machuda-board-4");
                });
                </script>
                """
                content = content.replace(b"</body>", script_inject + b"</body>")
                self.wfile.write(content)
            return
            
        elif "board_no=2" in parsed_url.query or board_no == '2' or "gallery" in path:
            # 납품사례(Board 2)
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            with open(os.path.join(WORKSPACE_DIR, "scratch", "live_board_2.html"), "rb") as f:
                content = f.read()
                script_inject = b"""
                <script>
                document.addEventListener("DOMContentLoaded", function() {
                    document.documentElement.classList.add('machuda-board-2');
                    console.log("Injected class machuda-board-2");
                });
                </script>
                """
                content = content.replace(b"</body>", script_inject + b"</body>")
                self.wfile.write(content)
            return
            
        elif path == "/" or path == "/index.html" or path == "/main.html":
            # 메인페이지
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            with open(os.path.join(WORKSPACE_DIR, "scratch", "live_homepage.html"), "rb") as f:
                self.wfile.write(f.read())
            return
            
        elif path == "/product/search.html":
            # Live search proxy to bypass CORS locally
            keyword = query.get("keyword", [""])[0]
            live_url = "https://www.machuda.com/product/search.html?keyword=" + urllib.parse.quote(keyword)
            req = urllib.request.Request(live_url)
            user_agent = self.headers.get("User-Agent")
            if user_agent:
                req.add_header("User-Agent", user_agent)
                
            try:
                with urllib.request.urlopen(req) as resp:
                    resp_data = resp.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(resp_data)
            except Exception as e:
                self.send_error(500, f"Error proxying search request: {e}")
            return
            
        # Fallback to local files if any
        super().do_GET()

print(f"Starting test server on http://localhost:{PORT}")
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), MachudaTestHandler) as httpd:
    httpd.serve_forever()
