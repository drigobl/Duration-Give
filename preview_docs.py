#!/usr/bin/env python3
"""
Simple preview server for Jekyll documentation
This creates a basic preview without needing Ruby/Jekyll installed
"""

import http.server
import socketserver
import os
import re
from pathlib import Path

class JekyllPreviewHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Map root to index.md content
        if self.path == '/' or self.path == '':
            self.path = '/index.html'
            self.serve_markdown('index.md')
            return
        
        # Handle docs paths
        if self.path.startswith('/docs/'):
            md_path = '_' + self.path.rstrip('/') + '/index.md'
            if os.path.exists(md_path):
                self.serve_markdown(md_path)
                return
        
        # Handle assets
        if self.path.startswith('/assets/'):
            super().do_GET()
            return
            
        # Default handler
        super().do_GET()
    
    def serve_markdown(self, md_file):
        """Convert markdown to HTML and serve"""
        try:
            with open(md_file, 'r') as f:
                content = f.read()
            
            # Remove front matter
            content = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)
            
            # Basic markdown to HTML conversion
            html_content = self.markdown_to_html(content)
            
            # Wrap in layout
            html = self.get_layout(html_content)
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(html.encode())
        except Exception as e:
            self.send_error(404, f"File not found: {md_file}")
    
    def markdown_to_html(self, md):
        """Very basic markdown to HTML conversion"""
        # Headers
        md = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', md, flags=re.MULTILINE)
        md = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', md, flags=re.MULTILINE)
        md = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', md, flags=re.MULTILINE)
        
        # Links
        md = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', md)
        
        # Bold
        md = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', md)
        
        # Lists
        md = re.sub(r'^- (.*?)$', r'<li>\1</li>', md, flags=re.MULTILINE)
        md = re.sub(r'(<li>.*?</li>\n)+', r'<ul>\g<0></ul>', md, flags=re.DOTALL)
        
        # Paragraphs
        md = re.sub(r'\n\n', '</p><p>', md)
        md = f'<p>{md}</p>'
        
        return md
    
    def get_layout(self, content):
        """Get the HTML layout"""
        return f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Give Protocol Documentation</title>
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <header class="site-header">
        <div class="wrapper">
            <a class="site-title" href="/">
                <img src="/assets/logo.svg" alt="Give Protocol Logo" style="height: 2rem; width: 2rem;">
                Give Protocol Documentation
            </a>
            <nav class="site-nav">
                <div class="nav-item">
                    <a class="page-link" href="/docs/getting-started/">Getting Started</a>
                </div>
                <div class="nav-item">
                    <a class="page-link" href="/docs/user-guides/">User Guides</a>
                </div>
                <div class="nav-item">
                    <a class="page-link" href="/docs/technical/">Technical Docs</a>
                </div>
            </nav>
        </div>
    </header>
    
    <main class="page-content">
        <div class="wrapper">
            <div class="home">
                {content}
            </div>
        </div>
    </main>
    
    <footer class="site-footer">
        <div class="wrapper">
            <p>&copy; 2025 Give Protocol. Licensed under MIT.</p>
        </div>
    </footer>
</body>
</html>'''

# Start server
PORT = 4000
Handler = JekyllPreviewHandler

print(f"Starting preview server at http://localhost:{PORT}")
print("Press Ctrl+C to stop")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()