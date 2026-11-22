(() => {
  'use strict';

  const dialog = document.getElementById('logo-project-dialog');
  const logoLinks = [...document.querySelectorAll('.logo-item[href*="project/#"]')];
  if (!dialog || !logoLinks.length || typeof dialog.showModal !== 'function') return;

  // [title, context, role, date, image, logo] — logo is 'logo' or 'logo-invert' when no event photo exists yet.
  const projects = {
    'senja-teduh-pelita': ['Senja Teduh Pelita', 'Jakarta Movin × MALIQ · Indonesia Kaya', 'Rental & Collaboration', 'Jul 2026 · Graha Bhakti Budaya, TIM', 'assets/images/senja-teduh-pelita-2026.webp'],
    'symphonesia-bangga-indonesia': ['SYMPHONESIA: Bangga Indonesia', 'Erwin Gutawa Productions', 'Collaboration', 'Aug 2024 · Ciputra Artpreneur Theater', 'assets/images/erwin-gutawa-symphonesia-v-bangga-indonesia.webp'],
    'java-jazz-on-the-move': ['Java Jazz on the Move', 'Java Jazz Festival', 'Collaboration', 'May 2022 · Puri Indah Mall', 'assets/images/java-jazz-on-the-move-2022.webp'],
    'hammersonic-festival-2024': ['Hammersonic Festival 2024', 'Ravel Entertainment', 'Rental', 'May 2024 · Pantai Carnaval Ancol', 'assets/images/hammersonic-festival-2024.webp'],
    'erwin-gutawa-karaokestra': ['Erwin Gutawa Karaokestra', 'Pestapora 2024', 'Collaboration', 'Sep 2024 · JIExpo Kemayoran', 'assets/images/erwin-gutawa-karaokestra-pestapora-2024.webp'],
    'festival-cahaya-kebaikan': ['Festival Cahaya Kebaikan', '50 Tahun Tehbotol Sosro', 'Collaboration', 'Sep 2024 · Senayan Park', 'assets/images/festival-cahaya-kebaikan-2024.webp'],
    'malam-100-cinta-2024': ['Malam 100 Cinta 2024', 'SMARTFREN', 'Collaboration', 'Nov 2024 · JIExpo Kemayoran', 'assets/images/smartfren-malam-100-cinta-2024.webp'],
    'the-music-of-studio-ghibli': ['The Music of STUDIO GHIBLI', 'AFAID 2025', 'Rental', 'Jun 2025 · JCC', 'assets/images/the-music-of-studio-ghibli-afaid-2025.webp']
  };

  // Public pages where visitors can verify each project ("Lihat sumber").
  const sources = {
    'senja-teduh-pelita': 'https://indonesiakaya.com/agenda-budaya/musikal-senja-teduh-pelita-hadirkan-petualangan-emosional-masa-depan-bumi/',
    'symphonesia-bangga-indonesia': 'https://billboard-indonesia.com/scenes/events/2024/07/17/putri-ariani-voice-of-baceprot-tampil-di-erwin-gutawa-orchestra-symphonesia-bangga-indonesia/',
    'java-jazz-on-the-move': 'https://puriindahmall.co.id/news/java-jazz-on-the-move',
    'hammersonic-festival-2024': 'https://www.detik.com/pop/music/d-7326622/wadah-besar-hajatan-musik-cadas-hammersonic-2024-buat-penonton-berkesan',
    'erwin-gutawa-karaokestra': 'https://www.fortuneidn.com/news/line-up-pestapora-2024-ada-tulus-hingga-voice-of-baceprot-00-98121-gv5y0p',
    'festival-cahaya-kebaikan': 'https://www.tehbotolsosro.com/aktivitas/telusuri/berita/50-tahun-perjalanan-emas-tehbotol-sosro-menyebar-cahaya-kebaikan',
    'malam-100-cinta-2024': 'https://koran-jakarta.com/2024-11-27/pertunjukkan-konser-malam-100-cinta',
    'the-music-of-studio-ghibli': 'https://animefestival.asia/afaid25/concert/'
  };

  const closeButton = dialog.querySelector('.project-dialog-close');
  const dialogSource = dialog.querySelector('.project-dialog-source');
  const dialogMedia = dialog.querySelector('.project-dialog-media');
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
      const [title, context, role, date, image, logo] = project;
      dialogTitle.textContent = title;
      dialogContext.textContent = context;
      dialogRole.textContent = role;
      dialogDate.textContent = date;
      const source = sources[link.hash.slice(1)] || '';
      if (dialogSource) {
        dialogSource.hidden = !source;
        if (source) {
          dialogSource.href = source;
          dialogSource.setAttribute('aria-label', `Lihat sumber ${title} (tab baru)`);
        } else {
          dialogSource.removeAttribute('href');
        }
      }
      dialogMedia?.classList.toggle('project-dialog-media--logo', Boolean(logo));
      dialogImage.className = logo === 'logo-invert' ? 'logo-invert' : '';
      dialogImage.src = image;
      dialogImage.alt = logo ? '' : title;
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
