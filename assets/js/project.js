(() => {
  'use strict';

  const dialog = document.getElementById('project-dialog');
  const cards = [...document.querySelectorAll('.project-card')];
  if (!dialog || !cards.length || typeof dialog.showModal !== 'function') return;

  const closeButton = dialog.querySelector('.project-dialog-close');
  const dialogMedia = dialog.querySelector('.project-dialog-media');
  const dialogImage = dialog.querySelector('.project-dialog-media img');
  const dialogWordmark = dialog.querySelector('.project-dialog-media .project-wordmark');
  const dialogTitle = dialog.querySelector('#project-dialog-title');
  const dialogContext = dialog.querySelector('.project-dialog-context');
  const dialogRole = dialog.querySelector('.project-dialog-role');
  const dialogDate = dialog.querySelector('.project-dialog-date');
  const dialogSource = dialog.querySelector('.project-dialog-source');
  let activeCard = null;

  const cardText = (card, selector) => card.querySelector(selector)?.textContent.trim() || '';

  // Show the card's photo, client logo or client name in the dialog.
  const showMedia = (sourceMedia) => {
    const sourceImage = sourceMedia?.querySelector('img');
    const sourceWordmark = sourceMedia?.querySelector('.project-wordmark');
    dialogMedia?.classList.toggle('project-dialog-media--logo', Boolean(sourceMedia?.classList.contains('project-card-media--logo')));
    if (dialogWordmark) {
      dialogWordmark.textContent = sourceWordmark?.textContent.trim() || '';
      dialogWordmark.hidden = !sourceWordmark;
    }
    dialogImage.hidden = !sourceImage;
    dialogImage.className = sourceImage?.className || '';
    dialogImage.srcset = sourceImage?.srcset || '';
    dialogImage.sizes = sourceImage?.srcset ? '(max-width: 36rem) calc(100vw - 2rem), 34rem' : '';
    if (sourceImage) dialogImage.src = sourceImage.currentSrc || sourceImage.src;
    else dialogImage.removeAttribute('src');
    dialogImage.alt = sourceImage?.alt || '';
    dialogImage.style.objectPosition = sourceImage ? window.getComputedStyle(sourceImage).objectPosition : '';
  };

  const openProject = (card) => {
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
    if (dialogSource) {
      const source = card.dataset.source || '';
      dialogSource.hidden = !source;
      if (source) {
        dialogSource.href = source;
        dialogSource.setAttribute('aria-label', `Lihat sumber ${dialogTitle.textContent} (tab baru)`);
      } else {
        dialogSource.removeAttribute('href');
      }
    }
    showMedia(card.querySelector('.project-card-media'));
    dialog.showModal();
  };

  // A real (invisible) button covers each card, so keyboards and screen readers get a proper
  // "Lihat detail …" button while the card's own text stays readable.
  const addOpenButtons = () => {
    cards.forEach((card) => {
      const button = document.createElement('button');
      const label = document.createElement('span');
      button.type = 'button';
      button.className = 'card-open';
      button.setAttribute('aria-haspopup', 'dialog');
      label.className = 'visually-hidden';
      label.textContent = `Lihat detail ${cardText(card, 'h2, h3')}`;
      button.append(label);
      card.append(button);
    });
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => openProject(card));
  });

  closeButton?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    activeCard?.querySelector('.card-open')?.focus();
    activeCard = null;
  });

  addOpenButtons();

  const openLinkedProject = () => {
    const projectId = decodeURIComponent(window.location.hash.slice(1));
    if (!projectId) return;
    const linkedCard = document.getElementById(projectId);
    if (linkedCard?.matches('.project-card')) openProject(linkedCard);
  };

  window.addEventListener('hashchange', openLinkedProject);
  requestAnimationFrame(openLinkedProject);
})();
