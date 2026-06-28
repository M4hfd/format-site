// Burger menu
const burger = document.getElementById('burger-btn');
const mobileNav = document.getElementById('mobile-nav');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
}

// Active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link, .mobile-nav .nav__link').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('nav__link--active');
});
