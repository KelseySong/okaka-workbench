#!/usr/bin/env python3
"""
Vlog Workbench - 本地测试服务器
在电脑上运行后，手机和平板连同一 WiFi 即可访问
"""
import http.server
import socketserver
import socket
import os
import sys

PORT = 8080
DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'www')

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Add CORS headers for PWA
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'same-origin')
        super().end_headers()

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    local_ip = get_local_ip()

    print("=" * 50)
    print("  🎬 Vlog Workbench 本地服务器")
    print("=" * 50)
    print()
    print("  📱 在你的手机/平板浏览器打开以下地址：")
    print()
    print(f"     http://{local_ip}:{PORT}")
    print()
    print("  💡 确保手机和电脑连同一个 WiFi")
    print()
    print("  📲 打开后按提示「添加到主屏幕」即可")
    print()
    print("  按 Ctrl+C 停止服务器")
    print("=" * 50)

    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n服务器已停止")
            sys.exit(0)
