(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav-links');
  const desktopMenu = window.matchMedia('(min-width: 821px)');

  const setMenuState = (open) => {
    if (!menuToggle || !navigation) return;
    navigation.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    document.body.classList.toggle('menu-open', open);
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      setMenuState(!navigation.classList.contains('open'));
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navigation.classList.contains('open')) {
        setMenuState(false);
        menuToggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (
        navigation.classList.contains('open') &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        setMenuState(false);
      }
    });

    desktopMenu.addEventListener('change', (event) => {
      if (event.matches) setMenuState(false);
    });
  }

  const faqItems = [...document.querySelectorAll('.faq-item')];
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tracks = [...document.querySelectorAll('[data-scroll-track], .project-track')];

  tracks.forEach((track) => {
    const controls = [
      ...document.querySelectorAll('[data-scroll-target="' + track.id + '"]'),
    ];

    const updateControls = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      controls.forEach((control) => {
        const direction = Number(control.dataset.direction || 1);
        const atStart = track.scrollLeft <= 2;
        const atEnd = track.scrollLeft >= maxScroll - 2;
        control.disabled = direction < 0 ? atStart : atEnd;
      });
    };

    controls.forEach((control) => {
      control.addEventListener('click', () => {
        const direction = Number(control.dataset.direction || 1);
        const amount = Math.min(track.clientWidth * 0.82, 720);
        track.scrollBy({
          left: direction * amount,
          behavior: reducedMotion.matches ? 'auto' : 'smooth',
        });
      });
    });

    track.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls);
    requestAnimationFrame(updateControls);
  });

  const mobileCardLayout = window.matchMedia('(max-width: 680px)');
  const projectTitles = [...document.querySelectorAll(
    '.project-row .project-card h3, .project-grid .project-card h2'
  )];

  const updateProjectTitleWrapping = () => {
    projectTitles.forEach((title) => {
      title.classList.remove('project-title-wrap');
      if (!mobileCardLayout.matches || title.clientWidth === 0) return;
      if (title.hasAttribute('data-force-wrap')) {
        title.classList.add('project-title-wrap');
        return;
      }
      if (title.scrollWidth > title.clientWidth + 1) title.classList.add('project-title-wrap');
    });
  };

  if (projectTitles.length) {
    window.addEventListener('resize', updateProjectTitleWrapping);
    mobileCardLayout.addEventListener('change', updateProjectTitleWrapping);
    requestAnimationFrame(updateProjectTitleWrapping);
    document.fonts?.ready.then(updateProjectTitleWrapping);
  }
})();
