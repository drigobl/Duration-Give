/**
 * Dynamically add icons to section headers based on content
 */
class SectionIcons {
  constructor() {
    this.iconMap = {
      // Navigation and Quick Links
      'quick links': 'fas fa-external-link-alt',
      'navigation': 'fas fa-compass',
      'menu': 'fas fa-bars',
      
      // Getting Started
      'getting started': 'fas fa-play-circle',
      'quick start': 'fas fa-rocket',
      'first steps': 'fas fa-baby-carriage',
      'setup': 'fas fa-cog',
      
      // Features
      'features': 'fas fa-star',
      'platform features': 'fas fa-cogs',
      'capabilities': 'fas fa-magic',
      
      // Support and Help
      'support': 'fas fa-hands-helping',
      'help': 'fas fa-question-circle',
      'contact': 'fas fa-envelope',
      'assistance': 'fas fa-headset',
      
      // Community
      'community': 'fas fa-users',
      'social': 'fas fa-share-alt',
      'forums': 'fas fa-comments',
      
      // Security
      'security': 'fas fa-shield-alt',
      'safety': 'fas fa-hard-hat',
      'protection': 'fas fa-lock',
      
      // Resources and Tools
      'resources': 'fas fa-toolbox',
      'tools': 'fas fa-wrench',
      'calculator': 'fas fa-calculator',
      'tracking': 'fas fa-clock',
      
      // FAQ and Questions
      'faq': 'fas fa-question-circle',
      'questions': 'fas fa-question',
      'answers': 'fas fa-lightbulb',
      
      // Technical
      'technical': 'fas fa-code',
      'api': 'fas fa-plug',
      'documentation': 'fas fa-book',
      'development': 'fas fa-laptop-code',
      
      // Popular and Trending
      'popular': 'fas fa-fire',
      'trending': 'fas fa-chart-line',
      'top': 'fas fa-arrow-up',
      
      // Financial
      'fees': 'fas fa-coins',
      'pricing': 'fas fa-dollar-sign',
      'cost': 'fas fa-money-bill',
      
      // Account and User
      'account': 'fas fa-user-circle',
      'profile': 'fas fa-user',
      'settings': 'fas fa-cog',
      
      // General
      'overview': 'fas fa-flag',
      'about': 'fas fa-info-circle',
      'details': 'fas fa-list',
      'benefits': 'fas fa-thumbs-up',
      'advantages': 'fas fa-plus-circle'
    };
    
    this.init();
  }
  
  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.addIconsToHeaders());
    } else {
      this.addIconsToHeaders();
    }
  }
  
  addIconsToHeaders() {
    // Find all h2 and h3 elements in the main content
    const headers = document.querySelectorAll('.page-content h2, .page-content h3');
    
    headers.forEach(header => {
      const text = header.textContent.toLowerCase().trim();
      const icon = this.findMatchingIcon(text);
      
      if (icon && !header.querySelector('i')) {
        this.addIconToHeader(header, icon);
      }
    });
    
    // Also add icons to card headers
    this.addIconsToCards();
  }
  
  addIconsToCards() {
    // Find card headers in various grid layouts
    const cardHeaders = document.querySelectorAll('.help-card h3, .community-section h3, .security-section h3, .tech-section h3, .resource-section h3');
    
    cardHeaders.forEach(header => {
      // Check if it's a link inside the header
      const link = header.querySelector('a');
      const text = (link ? link.textContent : header.textContent).toLowerCase().trim();
      const icon = this.findMatchingIcon(text);
      
      if (icon && !header.querySelector('i')) {
        if (link) {
          this.addIconToElement(link, icon);
        } else {
          this.addIconToHeader(header, icon);
        }
      }
    });
  }
  
  addIconToElement(element, iconClass) {
    const icon = document.createElement('i');
    icon.className = iconClass;
    icon.setAttribute('aria-hidden', 'true');
    
    // Add icon as the first child
    element.insertBefore(icon, element.firstChild);
  }
  
  findMatchingIcon(text) {
    // Direct match first
    if (this.iconMap[text]) {
      return this.iconMap[text];
    }
    
    // Partial match - find the first key that appears in the text
    for (const [key, iconClass] of Object.entries(this.iconMap)) {
      if (text.includes(key)) {
        return iconClass;
      }
    }
    
    return null;
  }
  
  addIconToHeader(header, iconClass) {
    const icon = document.createElement('i');
    icon.className = iconClass;
    icon.setAttribute('aria-hidden', 'true');
    
    // Add icon as the first child
    header.insertBefore(icon, header.firstChild);
  }
}

// Initialize when script loads
new SectionIcons();