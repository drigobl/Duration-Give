// Enhanced Navigation for Jekyll Documentation

// Sticky header enhancement - add shadow when scrolled
window.addEventListener('scroll', function() {
  const header = document.querySelector('.site-header');
  if (header) {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});

// Smooth scroll behavior for anchor links with offset
document.addEventListener('DOMContentLoaded', function() {
  // Handle all anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset for sticky header
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight - 20; // 20px extra padding
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
  
  // Highlight current section in navigation
  const sections = document.querySelectorAll('h2[id], h3[id]');
  const navLinks = document.querySelectorAll('.sidebar-sublink');
  
  function highlightNavigation() {
    let scrollPosition = window.scrollY + 100; // Offset for header
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href').includes('#' + sectionId)) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
  
  // Throttle scroll event for performance
  let scrollTimer;
  window.addEventListener('scroll', function() {
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }
    scrollTimer = setTimeout(highlightNavigation, 10);
  });
  
  // Initial highlight
  highlightNavigation();
});

// Add loading states for links
document.addEventListener('DOMContentLoaded', function() {
  const internalLinks = document.querySelectorAll('a[href^="/"]');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Don't add loading state for anchor links
      if (this.getAttribute('href').includes('#')) return;
      
      // Add loading class to body
      document.body.classList.add('loading');
      
      // Add loading state to clicked link
      this.classList.add('loading');
    });
  });
});

// Enhanced keyboard navigation
document.addEventListener('keydown', function(e) {
  // Press '/' to focus search
  if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
    const searchInput = document.querySelector('.search-input');
    if (searchInput && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  }
  
  // Press 'Escape' to unfocus
  if (e.key === 'Escape') {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.blur) {
      activeElement.blur();
    }
  }
});

// Mobile menu toggle with enhanced functionality
document.addEventListener('DOMContentLoaded', function() {
  // Create mobile menu button if it doesn't exist
  const header = document.querySelector('.site-header .wrapper');
  const sidebar = document.querySelector('.docs-sidebar');
  
  if (header && sidebar) {
    // Create hamburger menu button
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.setAttribute('aria-label', 'Toggle navigation menu');
    menuButton.setAttribute('aria-expanded', 'false');
    
    // Create hamburger icon with animation
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    menuButton.appendChild(hamburger);
    
    // Toggle menu function
    function toggleMenu() {
      const isOpen = sidebar.classList.contains('mobile-open');
      
      sidebar.classList.toggle('mobile-open');
      menuButton.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      menuButton.setAttribute('aria-expanded', !isOpen);
      
      // Trap focus when menu is open
      if (!isOpen) {
        sidebar.focus();
      }
    }
    
    // Click handler for menu button
    menuButton.addEventListener('click', toggleMenu);
    
    // Close menu when clicking overlay
    document.addEventListener('click', function(e) {
      if (document.body.classList.contains('menu-open') && 
          !sidebar.contains(e.target) && 
          !menuButton.contains(e.target)) {
        toggleMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        toggleMenu();
        menuButton.focus();
      }
    });
    
    // Close menu when clicking a link
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          toggleMenu();
        }
      });
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth > 768 && document.body.classList.contains('menu-open')) {
          toggleMenu();
        }
      }, 250);
    });
    
    header.appendChild(menuButton);
  }
});

// Improve touch scrolling for mobile
document.addEventListener('DOMContentLoaded', function() {
  // Add touch-friendly scrolling to sidebar
  const sidebar = document.querySelector('.docs-sidebar');
  if (sidebar) {
    let startY;
    let scrollTop;
    
    sidebar.addEventListener('touchstart', function(e) {
      startY = e.touches[0].pageY;
      scrollTop = sidebar.scrollTop;
    }, { passive: true });
    
    sidebar.addEventListener('touchmove', function(e) {
      if (!startY) return;
      
      const y = e.touches[0].pageY;
      const walk = (startY - y) * 2;
      sidebar.scrollTop = scrollTop + walk;
    }, { passive: true });
  }
});