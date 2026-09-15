(() => {
  'use strict';

  const dialog = document.getElementById('project-dialog');
  const cards = [...document.querySelectorAll('.project-card')];
  if (!dialog || !cards.length || typeof dialog.showModal !== 'function') return;

  const closeButton = dialog.querySelector('.project-dialog-close');
  const dialogImage = dialog.querySelector('.project-dialog-media img');
  const dialogTitle = dialog.querySelector('#project-dialog-title');
  const dialogContext = dialog.querySelector('.project-dialog-context');
  const dialogRole = dialog.querySelector('.project-dialog-role');
  const dialogDate = dialog.querySelector('.project-dialog-date');
  let activeCard = null;

  const cardText = (card, selector) => card.querySelector(selector)?.textContent.trim() || '';

  const openProject = (card) => {
    const sourceImage = card.querySelector('.project-card-media img');
    const sourceContext = card.querySelector('.project-context');
    activeCard = card;
    dialogTitle.textContent = cardText(card, 'h2, h3');
    dialogContext.textContent = cardText(card, '.project-context');
    dialogRole.textContent = cardText(card, '.project-role');
    dialogDate.textContent = cardText(card, '.project-date');
    dialogContext.hidden = !dialogContext.textContent;
    dialogContext.classList.toggle('project-highlight', sourceContext?.classList.contains('project-highlight'));
    dialogRole.hidden = !dialogRole.textContent;
    dialogDate.hidden = !dialogDate.textContent;
    dialogImage.src = sourceImage?.currentSrc || sourceImage?.src || '';
    dialogImage.alt = sourceImage?.alt || '';
    dialogImage.style.objectPosition = sourceImage ? window.getComputedStyle(sourceImage).objectPosition : '';
    dialog.showModal();
  };

  const updateCardAccessibility = () => {
    cards.forEach((card) => {
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('aria-label', `Lihat detail ${cardText(card, 'h2, h3')}`);
    });
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => openProject(card));
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openProject(card);
    });
  });

  closeButton?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    activeCard?.focus();
    activeCard = null;
  });

  updateCardAccessibility();

  const openLinkedProject = () => {
    const projectId = decodeURIComponent(window.location.hash.slice(1));
    if (!projectId) return;
    const linkedCard = document.getElementById(projectId);
    if (linkedCard?.matches('.project-card')) openProject(linkedCard);
  };

  window.addEventListener('hashchange', openLinkedProject);
  requestAnimationFrame(openLinkedProject);
})();
