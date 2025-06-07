#!/usr/bin/env python3
"""
Simple preview server for Jekyll documentation.

This creates a basic preview without needing Ruby/Jekyll installed.
"""

import http.server
import json
import os
import re
import socketserver


class JekyllPreviewHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler for Jekyll documentation preview."""

    def do_GET(self):
        """Handle GET requests for documentation pages and assets."""
        # Map root to index.md content
        if self.path in ('/', ''):
            self.path = '/index.html'
            self.serve_markdown('index.md')
            return

        # Handle docs paths
        if self.path.startswith('/docs/'):
            md_path = '_' + self.path.rstrip('/') + '/index.md'
            if os.path.exists(md_path):
                self.serve_markdown(md_path)
                return

        # Handle search.json
        if self.path in ('/search.json', '/Duration-Give/search.json'):
            self.serve_search_json()
            return

        # Handle assets
        if self.path.startswith('/assets/'):
            super().do_GET()
            return

        # Default handler
        super().do_GET()

    def serve_markdown(self, md_file):
        """Convert markdown to HTML and serve."""
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Remove front matter
            content = re.sub(r'^---\n.*?\n---\n', '', content,
                           flags=re.DOTALL)

            # Basic markdown to HTML conversion
            html_content = self._markdown_to_html(content)

            # Wrap in layout
            html = self._get_layout(html_content)

            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(html.encode())
        except FileNotFoundError:
            self.send_error(404, f"File not found: {md_file}")
        except Exception as e:
            self.send_error(500, f"Error processing {md_file}: {str(e)}")

    @staticmethod
    def _markdown_to_html(md):
        """Very basic markdown to HTML conversion."""
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
        md = re.sub(r'(<li>.*?</li>\n)+', r'<ul>\g<0></ul>', md,
                   flags=re.DOTALL)

        # Paragraphs
        md = re.sub(r'\n\n', '</p><p>', md)
        md = f'<p>{md}</p>'

        return md

    def _get_layout(self, content):
        """Get the HTML layout with GitBook-style sidebar."""
        sidebar_html = self._get_sidebar()
        return f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Give Protocol Documentation</title>
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <header class="site-header">
        <div class="wrapper">
            <a class="site-title" href="/">
                <img src="/assets/logo.svg" alt="Give Protocol Logo" 
                     style="height: 2rem; width: 2rem;">
                Give Protocol Documentation
            </a>
            <div class="site-search">
                <input type="search" class="search-input" 
                       placeholder="Search docs..." />
            </div>
        </div>
    </header>
    
    <main class="page-content">
        <div class="docs-wrapper">
            {sidebar_html}
            
            <article class="doc-main">
                <div class="doc-container">
                    <div class="doc-content">
                        {content}
                    </div>
                </div>
            </article>
        </div>
    </main>
    
    <footer class="site-footer">
        <div class="wrapper">
            <p>&copy; 2025 Give Protocol. All rights reserved.</p>
        </div>
    </footer>
    
    <script src="/assets/js/search.js"></script>
</body>
</html>'''

    @staticmethod
    def _get_sidebar():
        """Generate sidebar navigation."""
        return '''<nav class="docs-sidebar">
        <div class="sidebar-content">
            <div class="sidebar-section">
                <h3 class="sidebar-heading">
                    <a href="/docs/help-center/" class="sidebar-link">
                        Help Center
                    </a>
                </h3>
                <ul class="sidebar-list">
                    <li>
                        <a href="/docs/help-center/faq/" 
                           class="sidebar-sublink">FAQ</a>
                    </li>
                    <li>
                        <a href="/docs/help-center/need-help/" 
                           class="sidebar-sublink">Need Help</a>
                    </li>
                    <li>
                        <a href="/docs/help-center/report-issue/" 
                           class="sidebar-sublink">Report Issue</a>
                    </li>
                </ul>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-heading">
                    <a href="/docs/introduction/" class="sidebar-link">
                        Introduction
                    </a>
                </h3>
                <ul class="sidebar-list">
                    <li>
                        <a href="/docs/introduction/what-is-give-protocol/" 
                           class="sidebar-sublink">What is Give Protocol</a>
                    </li>
                    <li>
                        <a href="/docs/introduction/how-to-join/" 
                           class="sidebar-sublink">How to Join</a>
                    </li>
                </ul>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-heading">
                    <a href="/docs/getting-started/" class="sidebar-link">
                        Getting Started
                    </a>
                </h3>
                <ul class="sidebar-list">
                    <li>
                        <a href="/docs/getting-started/creating-account/" 
                           class="sidebar-sublink">Creating Your Account</a>
                    </li>
                    <li>
                        <a href="/docs/getting-started/wallet-connection/" 
                           class="sidebar-sublink">Wallet Connection</a>
                    </li>
                    <li>
                        <a href="/docs/getting-started/first-steps/" 
                           class="sidebar-sublink">First Steps</a>
                    </li>
                    <li>
                        <a href="/docs/getting-started/dashboard/" 
                           class="sidebar-sublink">Dashboard Overview</a>
                    </li>
                </ul>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-heading">
                    <a href="/docs/user-guides/" class="sidebar-link">
                        User Guides
                    </a>
                </h3>
                <ul class="sidebar-list">
                    <li>
                        <a href="/docs/user-guides/donors/" 
                           class="sidebar-sublink">For Donors</a>
                    </li>
                    <li>
                        <a href="/docs/user-guides/organizations/" 
                           class="sidebar-sublink">For Organizations</a>
                    </li>
                    <li>
                        <a href="/docs/user-guides/volunteers/" 
                           class="sidebar-sublink">For Volunteers</a>
                    </li>
                </ul>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-heading">
                    <a href="/docs/platform-features/" class="sidebar-link">
                        Platform Features
                    </a>
                </h3>
                <ul class="sidebar-list">
                    <li>
                        <a href="/docs/platform-features/search-discovery/" 
                           class="sidebar-sublink">Search & Discovery</a>
                    </li>
                    <li>
                        <a href="/docs/platform-features/verification/" 
                           class="sidebar-sublink">Verification & Trust</a>
                    </li>
                </ul>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-heading">
                    <a href="/docs/technical/" class="sidebar-link">
                        Technical Docs
                    </a>
                </h3>
                <ul class="sidebar-list">
                    <li>
                        <a href="/docs/technical/cryptocurrencies/" 
                           class="sidebar-sublink">Supported Cryptocurrencies</a>
                    </li>
                    <li>
                        <a href="/docs/technical/fees/" 
                           class="sidebar-sublink">Transaction Fees</a>
                    </li>
                </ul>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-heading">
                    <a href="/docs/safety-security/" class="sidebar-link">
                        Safety & Security
                    </a>
                </h3>
                <ul class="sidebar-list">
                    <li>
                        <a href="/docs/safety-security/smart-giving/" 
                           class="sidebar-sublink">Smart Giving</a>
                    </li>
                    <li>
                        <a href="/docs/safety-security/volunteer-safety/" 
                           class="sidebar-sublink">Volunteer Safety</a>
                    </li>
                    <li>
                        <a href="/docs/safety-security/platform-security/" 
                           class="sidebar-sublink">Platform Security</a>
                    </li>
                </ul>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-heading">
                    <a href="/docs/community/" class="sidebar-link">
                        Community
                    </a>
                </h3>
                <ul class="sidebar-list">
                    <li>
                        <a href="/docs/community/forums/" 
                           class="sidebar-sublink">Forums Guidelines</a>
                    </li>
                    <li>
                        <a href="/docs/community/contact/" 
                           class="sidebar-sublink">Contact</a>
                    </li>
                    <li>
                        <a href="/docs/community/social/" 
                           class="sidebar-sublink">Social Media</a>
                    </li>
                </ul>
            </div>
            
            <div class="sidebar-section">
                <h3 class="sidebar-heading">
                    <a href="/docs/resources/" class="sidebar-link">
                        Resources
                    </a>
                </h3>
                <ul class="sidebar-list">
                    <li>
                        <a href="/docs/resources/calculator/" 
                           class="sidebar-sublink">Donation Calculator</a>
                    </li>
                    <li>
                        <a href="/docs/resources/time-tracking/" 
                           class="sidebar-sublink">Time Tracking</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>'''

    def serve_search_json(self):
        """Serve a mock search index for preview."""
        search_data = [
            {
                "title": "Getting Started",
                "url": "/docs/getting-started/",
                "content": ("Learn how to get started with Give Protocol. "
                          "Set up your account, connect your wallet, "
                          "and make your first donation."),
                "excerpt": "Quick start guide for new users"
            },
            {
                "title": "Creating Your Account",
                "url": "/docs/getting-started/creating-account/",
                "content": ("Step by step guide to creating your "
                          "Give Protocol account. Connect wallet, "
                          "verify email, complete profile."),
                "excerpt": "Account creation walkthrough"
            },
            {
                "title": "For Donors",
                "url": "/docs/user-guides/donors/",
                "content": ("Complete guide for donors. Learn how to find "
                          "charities, make donations, track impact, "
                          "and manage recurring giving."),
                "excerpt": "Everything donors need to know"
            },
            {
                "title": "Technical Documentation",
                "url": "/docs/technical/",
                "content": ("Technical documentation for developers. "
                          "API reference, smart contract details, "
                          "supported cryptocurrencies."),
                "excerpt": "Developer resources and technical details"
            }
        ]

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(search_data).encode())


def main():
    """Start the preview server."""
    port = 4000
    handler = JekyllPreviewHandler

    print(f"Starting preview server at http://localhost:{port}")
    print("Press Ctrl+C to stop")

    with socketserver.TCPServer(("", port), handler) as httpd:
        httpd.serve_forever()


if __name__ == "__main__":
    main()