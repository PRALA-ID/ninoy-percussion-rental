(() => {
  'use strict';

  const catalog = document.querySelector('[data-catalog]');
  if (!catalog) return;

  const cards = [...catalog.querySelectorAll('[data-catalog-item]')];
  const filterGroups = [...catalog.querySelectorAll('[data-filter-group]')];
  const resultCount = document.getElementById('catalog-count');
  const emptyState = document.getElementById('catalog-empty');
  const dimensions = ['category'];
  const state = {
    category: 'all'
  };

  const groupFor = dimension => filterGroups.find(group => group.dataset.filterGroup === dimension);

  const isValidValue = (dimension, value) => {
    const group = groupFor(dimension);
    return Boolean(group && [...group.querySelectorAll('[data-filter-value]')]
      .some(button => button.dataset.filterValue === value));
  };

  const updateCategoryQuery = () => {
    if (!window.history || !window.history.replaceState) return;

    try {
      const url = new URL(window.location.href);
      if (state.category === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', state.category);
      }
      window.history.replaceState(window.history.state, '', url);
    } catch {
      // Filtering remains fully functional if URL rewriting is unavailable.
    }
  };

  const render = () => {
    let visibleCount = 0;

    cards.forEach(card => {
      const visible = dimensions.every(dimension => (
        state[dimension] === 'all' || card.dataset[dimension] === state[dimension]
      ));

      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    filterGroups.forEach(group => {
      const dimension = group.dataset.filterGroup;
      group.querySelectorAll('[data-filter-value]').forEach(button => {
        const selected = button.dataset.filterValue === state[dimension];
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
    });

    if (resultCount) resultCount.textContent = `${visibleCount} instrumen`;
    if (emptyState) emptyState.hidden = visibleCount !== 0;
  };

  const setFilter = (dimension, value) => {
    if (!dimensions.includes(dimension) || !isValidValue(dimension, value)) return;
    state[dimension] = value;
    updateCategoryQuery();
    render();
  };

  filterGroups.forEach(group => {
    const dimension = group.dataset.filterGroup;
    group.querySelectorAll('[data-filter-value]').forEach(button => {
      button.addEventListener('click', () => setFilter(dimension, button.dataset.filterValue));
    });
  });

  const requestedCategory = new URLSearchParams(window.location.search).get('category');
  if (requestedCategory) {
    const normalizedCategory = requestedCategory.trim().toLowerCase();
    if (isValidValue('category', normalizedCategory)) state.category = normalizedCategory;
  }

  render();

  const dialog = document.getElementById('catalog-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const closeButton = dialog.querySelector('.project-dialog-close');
  const dialogImage = dialog.querySelector('.project-dialog-media img');
  const dialogTitle = dialog.querySelector('#catalog-dialog-title');
  const dialogMeta = dialog.querySelector('.catalog-dialog-meta');
  const dialogPrice = dialog.querySelector('.catalog-dialog-price');
  let activeCard = null;

  const cardText = (card, selector) => card.querySelector(selector)?.textContent.trim() || '';

  const openInstrument = (card) => {
    const sourceImage = card.querySelector('.catalog-card-media img');
    const metadata = [...card.querySelectorAll('.catalog-card-meta span')]
      .map(item => item.textContent.trim())
      .filter(Boolean)
      .join(' · ');

    activeCard = card;
    dialogTitle.textContent = cardText(card, 'h3');
    dialogMeta.textContent = metadata;
    dialogPrice.textContent = cardText(card, '.catalog-card-price');
    dialogMeta.hidden = !metadata;
    dialogPrice.hidden = !dialogPrice.textContent;
    dialogImage.src = sourceImage?.currentSrc || sourceImage?.src || '';
    dialogImage.alt = sourceImage?.alt || '';
    dialog.showModal();
  };

  const updateCardAccessibility = () => {
    cards.forEach((card) => {
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('aria-label', `Lihat detail ${cardText(card, 'h3')}`);
    });
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => openInstrument(card));
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openInstrument(card);
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
})();
