document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Load saved theme safely
  const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-dark', 'true');
    if (themeIcon) themeIcon.className = 'ti ti-sun';
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.hasAttribute('data-dark');
      if (isDark) {
        document.documentElement.removeAttribute('data-dark');
        if (themeIcon) themeIcon.className = 'ti ti-moon';
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('theme', 'light');
        }
      } else {
        document.documentElement.setAttribute('data-dark', 'true');
        if (themeIcon) themeIcon.className = 'ti ti-sun';
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('theme', 'dark');
        }
      }
    });
  }

  // Lọc sản phẩm theo danh mục
  const filterPills = document.querySelectorAll('.filter-pill');
  const productCards = document.querySelectorAll('.product-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Toggle Active Class
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter');

      // Filter Cards
      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'Tất cả' || cardCategory === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Handle Image Fallbacks safely
  const productImages = document.querySelectorAll('.product-img img');
  productImages.forEach(img => {
    img.addEventListener('error', () => {
      img.src = 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=480&q=80';
    });
  });
});
