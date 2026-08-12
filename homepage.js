(() => {
  const button = document.querySelector('.back-to-top');

  if (!button) {
    return;
  }

  const storageKey = 'jiacheng.backToTopPosition.v1';
  const edgeMargin = 12;
  const dragThreshold = 6;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let savedPosition = null;
  let dragState = null;
  let suppressNextClick = false;

  const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

  const getBounds = () => {
    const rect = button.getBoundingClientRect();

    return {
      minX: edgeMargin,
      maxX: Math.max(edgeMargin, window.innerWidth - rect.width - edgeMargin),
      minY: edgeMargin,
      maxY: Math.max(edgeMargin, window.innerHeight - rect.height - edgeMargin)
    };
  };

  const setPosition = (left, top) => {
    const bounds = getBounds();

    button.style.left = `${clamp(left, bounds.minX, bounds.maxX)}px`;
    button.style.top = `${clamp(top, bounds.minY, bounds.maxY)}px`;
    button.style.right = 'auto';
    button.style.bottom = 'auto';
  };

  const applySavedPosition = () => {
    if (!savedPosition) {
      return;
    }

    const bounds = getBounds();
    const availableWidth = bounds.maxX - bounds.minX;
    const availableHeight = bounds.maxY - bounds.minY;

    setPosition(
      bounds.minX + availableWidth * savedPosition.x,
      bounds.minY + availableHeight * savedPosition.y
    );
  };

  const storeCurrentPosition = () => {
    const bounds = getBounds();
    const rect = button.getBoundingClientRect();
    const availableWidth = bounds.maxX - bounds.minX;
    const availableHeight = bounds.maxY - bounds.minY;

    savedPosition = {
      x: availableWidth > 0 ? (rect.left - bounds.minX) / availableWidth : 1,
      y: availableHeight > 0 ? (rect.top - bounds.minY) / availableHeight : 1
    };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(savedPosition));
    } catch (_) {
      // The button remains draggable when browser storage is unavailable.
    }
  };

  const restorePosition = () => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey));

      if (Number.isFinite(stored?.x) && Number.isFinite(stored?.y)) {
        savedPosition = {
          x: clamp(stored.x, 0, 1),
          y: clamp(stored.y, 0, 1)
        };
        applySavedPosition();
      }
    } catch (_) {
      savedPosition = null;
    }
  };

  const updateVisibility = () => {
    const isVisible = window.scrollY > 360;

    button.classList.toggle('is-visible', isVisible);
    button.setAttribute('aria-hidden', String(!isVisible));
    button.tabIndex = isVisible ? 0 : -1;
  };

  const finishDrag = (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) {
      return;
    }

    button.classList.remove('is-dragging');

    if (dragState.moved) {
      suppressNextClick = true;
      storeCurrentPosition();
      window.setTimeout(() => {
        suppressNextClick = false;
      }, 0);
    }

    dragState = null;
  };

  button.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    const rect = button.getBoundingClientRect();

    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      moved: false
    };

    button.classList.add('is-dragging');
  });

  window.addEventListener('pointermove', (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (!dragState.moved && Math.hypot(deltaX, deltaY) >= dragThreshold) {
      dragState.moved = true;
    }

    if (dragState.moved) {
      event.preventDefault();
      setPosition(dragState.startLeft + deltaX, dragState.startTop + deltaY);
    }
  });

  window.addEventListener('pointerup', finishDrag);
  window.addEventListener('pointercancel', finishDrag);

  button.addEventListener('click', (event) => {
    if (suppressNextClick) {
      event.preventDefault();
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
  });

  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', applySavedPosition);

  restorePosition();
  updateVisibility();
})();
