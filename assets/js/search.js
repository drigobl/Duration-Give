/**
 * Simple client-side search for Jekyll documentation
 */
class DocumentationSearch {
  constructor() {
    this.searchIndex = [];
    this.searchInput = null;
    this.searchResults = null;
    this.isLoading = false;
    
    this.init();
  }
  
  async init() {
    this.searchInput = document.querySelector('.search-input');
    if (!this.searchInput) return;
    
    // Create search results container
    this.createSearchResults();
    
    // Update shortcut display for current platform
    this.updateShortcutDisplay();
    
    // Load search index
    await this.loadSearchIndex();
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  createSearchResults() {
    // Check if search results already exists in HTML
    this.searchResults = document.querySelector('.search-results');
    
    if (!this.searchResults) {
      // Create search results container if it doesn't exist
      this.searchResults = document.createElement('div');
      this.searchResults.className = 'search-results';
      this.searchResults.innerHTML = `
        <div class="search-results-header">
          <span class="search-results-count"></span>
          <button class="search-results-close">&times;</button>
        </div>
        <div class="search-results-list"></div>
      `;
      
      // Insert after the search input
      this.searchInput.parentElement.appendChild(this.searchResults);
    } else {
      // Add inner structure if container exists but is empty
      if (!this.searchResults.querySelector('.search-results-header')) {
        this.searchResults.innerHTML = `
          <div class="search-results-header">
            <span class="search-results-count"></span>
            <button class="search-results-close">&times;</button>
          </div>
          <div class="search-results-list"></div>
        `;
      }
    }
    
    // Close button functionality
    const closeBtn = this.searchResults.querySelector('.search-results-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideResults();
      });
    }
  }
  
  async loadSearchIndex() {
    try {
      this.isLoading = true;
      // Get the base URL from the current page
      const baseUrl = document.querySelector('base')?.href || window.location.origin;
      const searchUrl = new URL('/search.json', baseUrl).href;
      
      console.log('Loading search index from:', searchUrl);
      
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search index loaded:', data.length, 'items');
      
      this.searchIndex = data || [];
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to load search index:', error);
      this.isLoading = false;
      
      // Try with relative URL as fallback
      try {
        const fallbackUrl = (window.location.pathname.includes('/Duration-Give/') 
          ? '/Duration-Give/search.json' 
          : '/search.json');
          
        console.log('Trying fallback URL:', fallbackUrl);
        const response = await fetch(fallbackUrl);
        const data = await response.json();
        this.searchIndex = data || [];
        console.log('Search index loaded from fallback:', this.searchIndex.length, 'items');
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
  }
  
  setupEventListeners() {
    let searchTimeout;
    
    // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.focusSearch();
      }
    });
    
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      
      if (query.length < 2) {
        this.hideResults();
        return;
      }
      
      // Debounce search
      searchTimeout = setTimeout(() => {
        this.performSearch(query);
      }, 300);
    });
    
    this.searchInput.addEventListener('focus', (e) => {
      if (e.target.value.trim().length >= 2) {
        this.showResults();
      }
      // Update shortcut display based on platform
      this.updateShortcutDisplay();
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
        this.hideResults();
      }
    });
    
    // Keyboard navigation
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideResults();
        this.searchInput.blur();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateResults('down');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateResults('up');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.selectResult();
      }
    });
  }
  
  focusSearch() {
    this.searchInput.focus();
    this.searchInput.select();
    
    // Show placeholder results if there's existing text
    if (this.searchInput.value.trim().length >= 2) {
      this.showResults();
    }
  }
  
  updateShortcutDisplay() {
    const shortcutElement = document.querySelector('.search-shortcut');
    if (shortcutElement) {
      // Detect platform and show appropriate shortcut
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      shortcutElement.textContent = isMac ? '⌘K' : 'Ctrl+K';
    }
  }
  
  performSearch(query) {
    if (this.isLoading || !this.searchIndex.length) {
      this.showLoading();
      return;
    }
    
    const results = this.searchIndex.filter(item => {
      const searchText = `${item.title} ${item.content} ${item.excerpt}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });
    
    // Sort by relevance (title matches first, then content)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(query.toLowerCase());
      const bTitle = b.title.toLowerCase().includes(query.toLowerCase());
      
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return 0;
    });
    
    this.displayResults(results, query);
  }
  
  displayResults(results, query) {
    const resultsContainer = this.searchResults.querySelector('.search-results-list');
    const countContainer = this.searchResults.querySelector('.search-results-count');
    
    countContainer.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
    
    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-no-results">
          <p>No results found for "${query}"</p>
          <p class="search-no-results-hint">Try different keywords or check spelling</p>
        </div>
      `;
    } else {
      resultsContainer.innerHTML = results.slice(0, 10).map((result, index) => `
        <a href="${result.url}" class="search-result-item" data-index="${index}">
          <h4 class="search-result-title">${this.highlightText(result.title, query)}</h4>
          <p class="search-result-excerpt">${this.highlightText(result.excerpt || result.content, query)}</p>
          <span class="search-result-url">${result.url}</span>
        </a>
      `).join('');
    }
    
    this.showResults();
  }
  
  highlightText(text, query) {
    if (!text) return '';
    // Escape regex special characters in query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  showLoading() {
    const resultsContainer = this.searchResults.querySelector('.search-results-list');
    resultsContainer.innerHTML = '<div class="search-loading">Searching...</div>';
    this.showResults();
  }
  
  showResults() {
    this.searchResults.classList.add('show');
  }
  
  hideResults() {
    this.searchResults.classList.remove('show');
    this.searchInput.blur();
  }
  
  navigateResults(direction) {
    const items = this.searchResults.querySelectorAll('.search-result-item');
    const current = this.searchResults.querySelector('.search-result-item.focused');
    let index = -1;
    
    if (current) {
      index = parseInt(current.dataset.index, 10);
      current.classList.remove('focused');
    }
    
    if (direction === 'down') {
      index = index < items.length - 1 ? index + 1 : 0;
    } else {
      index = index > 0 ? index - 1 : items.length - 1;
    }
    
    if (items[index]) {
      items[index].classList.add('focused');
      items[index].scrollIntoView({ block: 'nearest' });
    }
  }
  
  selectResult() {
    const focused = this.searchResults.querySelector('.search-result-item.focused');
    if (focused) {
      window.location.href = focused.href;
    }
  }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DocumentationSearch();
});