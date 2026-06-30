document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.getElementById('sidebarToggle');
  if (!sidebar || !toggle) return;

  const icon = toggle.querySelector('i');

  function syncToggle() {
    const isHidden = document.body.classList.contains('sidebar-hidden');
    toggle.title = isHidden ? 'Show icon bar' : 'Hide icon bar';
    toggle.setAttribute('aria-label', toggle.title);
    toggle.setAttribute('aria-pressed', String(isHidden));

    if (icon) {
      icon.classList.toggle('fa-eye', isHidden);
      icon.classList.toggle('fa-eye-slash', !isHidden);
    }
  }

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-hidden');
    syncToggle();
  });

  syncToggle();
});
