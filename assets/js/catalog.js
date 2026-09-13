(() => {
  'use strict';

  const catalog = document.querySelector('[data-catalog]');
  if (!catalog) return;

  const cards = [...catalog.querySelectorAll('[data-catalog-item]')];
  const filterGroups = [...catalog.querySelectorAll('[data-filter-group]')];
  const resultCount = document.getElementById('catalog-count');
  const emptyState = document.getElementById('catalog-empty');
  const resetButton = document.getElementById('catalog-reset');
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
    if (resetButton) resetButton.disabled = dimensions.every(dimension => state[dimension] === 'all');
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

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      dimensions.forEach(dimension => {
        state[dimension] = 'all';
      });
      updateCategoryQuery();
      render();
    });
  }

  const requestedCategory = new URLSearchParams(window.location.search).get('category');
  if (requestedCategory) {
    const normalizedCategory = requestedCategory.trim().toLowerCase();
    if (isValidValue('category', normalizedCategory)) state.category = normalizedCategory;
  }

  render();
})();
