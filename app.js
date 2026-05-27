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
});
