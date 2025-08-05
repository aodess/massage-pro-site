from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

port = int(os.environ.get('PORT', 8080))
httpd = HTTPServer(('', port), SimpleHTTPRequestHandler)
print(f'Server running on port {port}')
httpd.serve_forever()