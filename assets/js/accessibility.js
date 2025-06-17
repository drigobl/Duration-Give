// Accessibility Enhancements for Jekyll Documentation

// Announce page changes for screen readers
(function() {
  // Create live region for announcements
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.id = 'page-announcer';
  document.body.appendChild(announcer);
  
  // Announce page title changes
  function announcePageChange() {
    const pageTitle = document.title;
    announcer.textContent = `Navigated to ${pageTitle}`;
    
    // Clear announcement after 1 second
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
  
  // Listen for page navigation
  let lastTitle = document.title;
  const observer = new MutationObserver(() => {
    if (document.title !== lastTitle) {
      lastTitle = document.title;
      announcePageChange();
    }
  });
  
  observer.observe(document.querySelector('title'), {
    childList: true,
    characterData: true,
    subtree: true
  });
})();

// Enhanced keyboard navigation
document.addEventListener('DOMContentLoaded', function() {
  // Add keyboard navigation hints
  const keyboardHints = {
    '/': 'Search',
    'g h': 'Go to home',
    'g d': 'Go to documentation',
    'Escape': 'Close dialogs'
  };
  
  // Create keyboard shortcuts guide
  const shortcutsGuide = document.createElement('div');
  shortcutsGuide.className = 'keyboard-shortcuts-guide';
  shortcutsGuide.setAttribute('role', 'dialog');
  shortcutsGuide.setAttribute('aria-label', 'Keyboard shortcuts');
  shortcutsGuide.innerHTML = `
    <h2>Keyboard Shortcuts</h2>
    <button class="close-shortcuts" aria-label="Close shortcuts">&times;</button>
    <dl>
      ${Object.entries(keyboardHints).map(([key, action]) => `
        <dt><kbd>${key}</kbd></dt>
        <dd>${action}</dd>
      `).join('')}
    </dl>
  `;
  shortcutsGuide.style.display = 'none';
  document.body.appendChild(shortcutsGuide);
  
  // Show shortcuts with '?'
  let gPressed = false;
  document.addEventListener('keydown', function(e) {
    // Show shortcuts guide
    if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      shortcutsGuide.style.display = 'block';
      shortcutsGuide.focus();
      trapFocus(shortcutsGuide);
    }
    
    // Handle 'g' shortcuts
    if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
      gPressed = true;
      setTimeout(() => { gPressed = false; }, 1000);
      return;
    }
    
    if (gPressed) {
      switch(e.key) {
        case 'h': // Go home
          e.preventDefault();
          window.location.href = '/';
          break;
        case 'd': // Go to docs
          e.preventDefault();
          window.location.href = '/docs/';
          break;
      }
      gPressed = false;
    }
  });
  
  // Close shortcuts guide
  const closeButton = shortcutsGuide.querySelector('.close-shortcuts');
  closeButton.addEventListener('click', () => {
    shortcutsGuide.style.display = 'none';
  });
});

// Focus management utilities
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
    
    if (e.key === 'Escape') {
      element.style.display = 'none';
    }
  });
}

// Improve table navigation
document.addEventListener('DOMContentLoaded', function() {
  const tables = document.querySelectorAll('table');
  
  tables.forEach(table => {
    // Add scope attributes to headers
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      const row = header.closest('tr');
      const isRowHeader = row.querySelector('th') === header && row.querySelectorAll('th').length === 1;
      header.setAttribute('scope', isRowHeader ? 'row' : 'col');
    });
    
    // Make tables focusable and add instructions
    if (!table.hasAttribute('tabindex')) {
      table.setAttribute('tabindex', '0');
      table.setAttribute('role', 'table');
      table.setAttribute('aria-label', 'Data table. Use arrow keys to navigate.');
    }
  });
});

// Enhance form accessibility
document.addEventListener('DOMContentLoaded', function() {
  // Associate error messages with form fields
  const formFields = document.querySelectorAll('input, textarea, select');
  
  formFields.forEach(field => {
    const fieldId = field.id || `field-${Math.random().toString(36).substr(2, 9)}`;
    field.id = fieldId;
    
    // Find associated error message
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
      const errorId = `error-${fieldId}`;
      errorMessage.id = errorId;
      field.setAttribute('aria-describedby', errorId);
      field.setAttribute('aria-invalid', 'true');
    }
    
    // Find associated help text
    const helpText = field.parentElement.querySelector('.help-text');
    if (helpText) {
      const helpId = `help-${fieldId}`;
      helpText.id = helpId;
      const describedBy = field.getAttribute('aria-describedby');
      field.setAttribute('aria-describedby', describedBy ? `${describedBy} ${helpId}` : helpId);
    }
  });
});

// Live region for dynamic content updates
document.addEventListener('DOMContentLoaded', function() {
  // Create live region for search results
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');
  
  if (searchInput && searchResults) {
    // Announce result count
    const observer = new MutationObserver(() => {
      const resultCount = searchResults.querySelectorAll('.search-result-item').length;
      const announcer = document.getElementById('page-announcer');
      
      if (resultCount > 0) {
        announcer.textContent = `${resultCount} search results found`;
      } else if (searchResults.querySelector('.search-no-results')) {
        announcer.textContent = 'No search results found';
      }
    });
    
    observer.observe(searchResults, {
      childList: true,
      subtree: true
    });
  }
});

// Enhance code block accessibility
document.addEventListener('DOMContentLoaded', function() {
  const codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach(block => {
    // Make code blocks keyboard navigable
    block.setAttribute('tabindex', '0');
    block.setAttribute('role', 'region');
    
    // Add copy button with proper ARIA
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-button';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    copyButton.innerHTML = '<span aria-hidden="true">📋</span> Copy';
    
    copyButton.addEventListener('click', async () => {
      const code = block.textContent;
      try {
        await navigator.clipboard.writeText(code);
        copyButton.innerHTML = '<span aria-hidden="true">✓</span> Copied!';
        copyButton.setAttribute('aria-label', 'Code copied to clipboard');
        
        setTimeout(() => {
          copyButton.innerHTML = '<span aria-hidden="true">📋</span> Copy';
          copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    });
    
    block.style.position = 'relative';
    block.appendChild(copyButton);
  });
});

// Add heading navigation for screen readers
document.addEventListener('DOMContentLoaded', function() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  headings.forEach(heading => {
    // Ensure headings have IDs for anchor links
    if (!heading.id) {
      heading.id = heading.textContent
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    }
    
    // Add anchor link for direct navigation
    const anchor = document.createElement('a');
    anchor.href = `#${heading.id}`;
    anchor.className = 'heading-anchor';
    anchor.setAttribute('aria-label', `Link to ${heading.textContent}`);
    anchor.innerHTML = '<span aria-hidden="true">#</span>';
    
    heading.appendChild(anchor);
  });
});

// Respect user preferences
(function() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  function handleReducedMotionChange() {
    if (prefersReducedMotion.matches) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }
  
  prefersReducedMotion.addListener(handleReducedMotionChange);
  handleReducedMotionChange();
  
  // Check for high contrast preference
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
  
  function handleHighContrastChange() {
    if (prefersHighContrast.matches) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }
  
  prefersHighContrast.addListener(handleHighContrastChange);
  handleHighContrastChange();
})();