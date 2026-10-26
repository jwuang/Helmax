// Native <details> works without JavaScript; this only adds dismissal behaviour.
const menus = document.querySelectorAll<HTMLDetailsElement>('[data-language-menu], [data-mobile-menu]');
menus.forEach((menu) => {
  menu.addEventListener('toggle', () => {
    if (menu.open) menus.forEach((other) => { if (other !== menu) other.open = false; });
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  menus.forEach((menu) => {
    if (menu.open) { menu.open = false; menu.querySelector('summary')?.focus(); }
  });
});
document.addEventListener('click', (event) => {
  menus.forEach((menu) => { if (event.target instanceof HTMLElement && !menu.contains(event.target)) menu.open = false; });
});
