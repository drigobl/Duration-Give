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
    
    // Load search index
    await this.loadSearchIndex();
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  createSearchResults() {
    // Create search results container
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
    
    // Close button functionality
    this.searchResults.querySelector('.search-results-close').addEventListener('click', () => {
      this.hideResults();
    });
  }
  
  async loadSearchIndex() {
    try {
      this.isLoading = true;
      const response = await fetch('/Duration-Give/search.json');
      this.searchIndex = await response.json();
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to load search index:', error);
      this.isLoading = false;
    }
  }
  
  setupEventListeners() {
    let searchTimeout;
    
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
    const regex = new RegExp(`(${query})`, 'gi');
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
      index = parseInt(current.dataset.index);
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