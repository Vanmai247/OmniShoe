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

  // Chức năng giỏ hàng, wishlist & toast
  let wishlist = [];
  let cartCount = 0;

  const wishlistBadge = document.getElementById('wishlist-badge');
  const cartBadge = document.getElementById('cart-badge');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  function showToast(msg) {
    if (toastMessage) toastMessage.textContent = msg;
    if (toast) {
      toast.classList.add('show');
      // Xóa timeout cũ nếu có hoặc đặt timeout mới tự đóng sau 3 giây
      if (toast.timeoutId) clearTimeout(toast.timeoutId);
      toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }

  // Wishlist clicks
  const heartButtons = document.querySelectorAll('.wishlist-btn-card');
  heartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const productId = parseInt(card.getAttribute('data-id'));
      const productName = card.querySelector('.product-name').textContent;

      if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        btn.classList.remove('active');
        showToast("Đã xóa khỏi danh sách yêu thích 💔");
      } else {
        wishlist.push(productId);
        btn.classList.add('active');
        showToast("Đã thêm vào danh sách yêu thích ❤️");
      }
      if (wishlistBadge) wishlistBadge.textContent = wishlist.length;
    });
  });

  // Cart clicks
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const productName = card.querySelector('.product-name').textContent;

      cartCount++;
      if (cartBadge) cartBadge.textContent = cartCount;
      showToast(`Đã thêm ${productName} vào giỏ hàng! 🛒`);
    });
  });

  // Newsletter Form Submit handler safely
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("Đăng ký nhận tin thành công! 🎉 Hãy check hộp thư.");
      newsletterForm.reset();
    });
  }

  // Hamburger Mobile Menu toggle handler safely
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      showToast("Kích hoạt Menu di động thành công! 📱");
    });
  }
});
