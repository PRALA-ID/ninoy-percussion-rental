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

  // Categories follow the e-catalogue PDF; older links used finer groups.
  const legacyCategories = { mallet: 'pitched', drums: 'unpitched', cymbals: 'unpitched' };
  const requestedCategory = new URLSearchParams(window.location.search).get('category');
  if (requestedCategory) {
    const normalizedCategory = requestedCategory.trim().toLowerCase();
    const category = legacyCategories[normalizedCategory] || normalizedCategory;
    if (isValidValue('category', category)) state.category = category;
    updateCategoryQuery();
  }

  render();

  const dialog = document.getElementById('catalog-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const closeButton = dialog.querySelector('.project-dialog-close');
  const dialogImage = dialog.querySelector('.project-dialog-media img');
  const dialogTitle = dialog.querySelector('#catalog-dialog-title');
  const dialogMeta = dialog.querySelector('.catalog-dialog-meta');
  const dialogPrice = dialog.querySelector('.catalog-dialog-price');
  const dialogCta = dialog.querySelector('.catalog-dialog-cta');
  const WHATSAPP_URL = 'https://wa.me/6281128889804';
  let activeCard = null;

  const cardText = (card, selector) => card.querySelector(selector)?.textContent.trim() || '';

  // WhatsApp message names the item as the e-catalogue does ("Brand - Name") and links to the exact card,
  // so items that share a name in the catalogue can still be told apart.
  const bookingLink = (card) => {
    const brand = cardText(card, '.brand');
    const name = cardText(card, 'h3');
    const label = brand ? `${brand} - ${name}` : name;
    const itemUrl = `${window.location.origin}${window.location.pathname}#${card.id}`;
    const message = `Halo Ninoy, saya ingin cek ketersediaan ${label} (${cardText(card, '.catalog-card-price')}).\n${itemUrl}\n\nTanggal sewa: `;
    return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
  };

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
    dialogImage.srcset = sourceImage?.srcset || '';
    dialogImage.sizes = sourceImage?.srcset ? '(max-width: 36rem) calc(100vw - 2rem), 34rem' : '';
    dialogImage.src = sourceImage?.currentSrc || sourceImage?.src || '';
    dialogImage.alt = sourceImage?.alt || '';
    if (dialogCta) dialogCta.href = bookingLink(card);
    dialog.showModal();
  };

  // Links like /koleksi/#lp-maracas-red open that instrument directly.
  const openLinkedInstrument = () => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const card = id ? document.getElementById(id) : null;
    if (!card || !card.matches('[data-catalog-item]')) return;
    if (card.hidden) {
      state.category = 'all';
      updateCategoryQuery();
      render();
    }
    card.scrollIntoView({ block: 'center' });
    openInstrument(card);
  };

  // A real (invisible) button covers each card, so keyboards and screen readers get a proper
  // "Lihat detail …" button while the card's name, brand and price stay readable.
  const addOpenButtons = () => {
    cards.forEach((card) => {
      const button = document.createElement('button');
      const label = document.createElement('span');
      button.type = 'button';
      button.className = 'card-open';
      button.setAttribute('aria-haspopup', 'dialog');
      label.className = 'visually-hidden';
      label.textContent = `Lihat detail ${cardText(card, 'h3')}`;
      button.append(label);
      card.append(button);
    });
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => openInstrument(card));
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
  window.addEventListener('hashchange', openLinkedInstrument);
  requestAnimationFrame(openLinkedInstrument);
})();
