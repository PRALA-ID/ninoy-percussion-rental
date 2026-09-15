(() => {
  'use strict';

  const dialog = document.getElementById('logo-project-dialog');
  const logoLinks = [...document.querySelectorAll('.logo-item[href*="project/index.html#"]')];
  if (!dialog || !logoLinks.length || typeof dialog.showModal !== 'function') return;

  const projects = {
    'senja-teduh-pelita': ['Senja Teduh Pelita', 'Jakarta Movin × MALIQ · Indonesia Kaya', 'Rental & Collaboration', 'Jul 2026 · Graha Bhakti Budaya, TIM', 'assets/images/project-placeholder.svg'],
    'symphonesia-bangga-indonesia': ['SYMPHONESIA: Bangga Indonesia', 'Erwin Gutawa Productions', 'Collaboration', 'Aug 2024 · Ciputra Artpreneur Theater', 'assets/images/erwin-gutawa-symphonesia-v-bangga-indonesia.webp'],
    'java-jazz-on-the-move': ['Java Jazz on the Move', 'Java Jazz Festival', 'Collaboration', 'May 2022 · Puri Indah Mall', 'assets/images/java-jazz-on-the-move-2022.webp'],
    'hammersonic-festival-2024': ['Hammersonic Festival 2024', 'Ravel Entertainment', 'Rental', 'May 2024 · Pantai Carnaval Ancol', 'assets/images/project-placeholder.svg'],
    'erwin-gutawa-karaokestra': ['Erwin Gutawa Karaokestra', 'Pestapora 2024', 'Collaboration', 'Sep 2024 · JIExpo Kemayoran', 'assets/images/erwin-gutawa-karaokestra-pestapora-2024.webp'],
    'festival-cahaya-kebaikan': ['Festival Cahaya Kebaikan', '50 Tahun Tehbotol Sosro', 'Collaboration', 'Sep 2024 · Senayan Park', 'assets/images/project-placeholder.svg'],
    'malam-100-cinta-2024': ['Malam 100 Cinta 2024', 'SMARTFREN', 'Collaboration', 'Nov 2024 · JIEXPO', 'assets/images/smartfren-malam-100-cinta-2024.webp'],
    'the-music-of-studio-ghibli': ['The Music of STUDIO GHIBLI', 'AFAID 2025', 'Rental', 'Jun 2025 · JCC', 'assets/images/project-placeholder.svg']
  };

  const closeButton = dialog.querySelector('.project-dialog-close');
  const dialogImage = dialog.querySelector('.project-dialog-media img');
  const dialogTitle = dialog.querySelector('#logo-project-dialog-title');
  const dialogContext = dialog.querySelector('.project-dialog-context');
  const dialogRole = dialog.querySelector('.project-dialog-role');
  const dialogDate = dialog.querySelector('.project-dialog-date');
  let activeLink = null;

  logoLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const project = projects[link.hash.slice(1)];
      if (!project) return;

      event.preventDefault();
      activeLink = link;
      [dialogTitle.textContent, dialogContext.textContent, dialogRole.textContent, dialogDate.textContent, dialogImage.src] = project;
      dialogImage.alt = project[0];
      dialog.showModal();
    });
  });

  closeButton?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    activeLink?.focus();
    activeLink = null;
  });
})();
