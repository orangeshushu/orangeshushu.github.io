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

  const visitorPanel = document.querySelector('.visitor-panel');

  if (visitorPanel) {
    const mapElement = visitorPanel.querySelector('[data-visitor-map]');
    const statusElement = visitorPanel.querySelector('[data-visitor-status]');
    const tooltipElement = visitorPanel.querySelector('[data-visitor-tooltip]');
    const locationsElement = visitorPanel.querySelector('[data-visitor-locations]');
    const noteElement = visitorPanel.querySelector('[data-visitor-note]');
    const isLocalPreview = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const endpoint = isLocalPreview ? '/api/jiacheng-visitors' : visitorPanel.dataset.endpoint;
    const numberFormatter = new Intl.NumberFormat('en-US');

    const setStat = (name, value) => {
      const element = visitorPanel.querySelector(`[data-visitor-stat="${name}"]`);
      if (element) {
        element.textContent = numberFormatter.format(Number(value) || 0);
      }
    };

    const locationTitle = (location) => location.city || location.region || location.country || 'Unknown';

    const locationSubtitle = (location) => {
      const title = locationTitle(location);
      return location.country && location.country !== title ? location.country : (location.region || 'Approximate location');
    };

    const locationKey = (location) => [
      location.city,
      location.region,
      location.country,
      location.lat,
      location.lon
    ].join('|');

    const renderLocationList = (locations) => {
      locationsElement.replaceChildren();
      if (!locations.length) {
        const empty = document.createElement('li');
        empty.className = 'visitor-location-empty';
        empty.textContent = 'No visitor locations yet.';
        locationsElement.appendChild(empty);
        return;
      }

      locations.slice(0, 4).forEach((location, index) => {
        const item = document.createElement('li');
        item.tabIndex = 0;
        item.dataset.locationKey = locationKey(location);

        const rank = document.createElement('span');
        rank.className = 'visitor-location-rank';
        rank.textContent = String(index + 1).padStart(2, '0');

        const name = document.createElement('span');
        name.className = 'visitor-location-name';
        const nameStrong = document.createElement('strong');
        nameStrong.textContent = locationTitle(location);
        const nameSecondary = document.createElement('span');
        nameSecondary.textContent = locationSubtitle(location);
        name.append(nameStrong, nameSecondary);

        const count = document.createElement('span');
        count.className = 'visitor-location-count';
        count.textContent = numberFormatter.format(Number(location.count) || 0);
        item.append(rank, name, count);
        locationsElement.appendChild(item);
      });
    };

    const loadD3 = () => {
      if (window.d3) {
        return Promise.resolve(window.d3);
      }
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'vendor/d3.v7.9.0.min.js?v=20260828.1';
        script.onload = () => resolve(window.d3);
        script.onerror = () => reject(new Error('Map library unavailable'));
        document.head.appendChild(script);
      });
    };

    const renderMap = (world, locations) => {
      const d3 = window.d3;
      const width = 720;
      const height = 320;
      const projection = d3.geoNaturalEarth1().fitExtent([[18, 14], [width - 18, height - 14]], world);
      const path = d3.geoPath(projection);
      const maxCount = d3.max(locations, (location) => Number(location.count)) || 1;
      const radius = d3.scaleSqrt().domain([1, maxCount]).range([3.5, 9]);

      mapElement.querySelector('svg')?.remove();
      const svg = d3.select(mapElement).insert('svg', '.visitor-map-status')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('role', 'img')
        .attr('aria-label', mapElement.getAttribute('aria-label'));
      const layer = svg.append('g');

      layer.append('path')
        .datum({ type: 'Sphere' })
        .attr('class', 'visitor-map-sphere')
        .attr('d', path);
      layer.append('path')
        .datum(d3.geoGraticule10())
        .attr('class', 'visitor-map-grid')
        .attr('d', path);
      layer.selectAll('path.visitor-map-country')
        .data(world.features)
        .join('path')
        .attr('class', 'visitor-map-country')
        .attr('d', path);

      const showTooltip = (event, location) => {
        const mapRect = mapElement.getBoundingClientRect();
        const markerRect = event.currentTarget.getBoundingClientRect();
        const x = markerRect.left - mapRect.left + markerRect.width / 2;
        const y = markerRect.top - mapRect.top + markerRect.height / 2;
        tooltipElement.replaceChildren();
        const title = document.createElement('strong');
        title.textContent = locationTitle(location);
        const detail = document.createElement('span');
        detail.textContent = `${locationSubtitle(location)} · ${numberFormatter.format(Number(location.count) || 0)}`;
        tooltipElement.append(title, detail);
        tooltipElement.hidden = false;
        tooltipElement.style.left = `${Math.min(mapRect.width - 150, Math.max(8, x + 12))}px`;
        tooltipElement.style.top = `${Math.min(mapRect.height - 58, Math.max(8, y - 22))}px`;
      };

      const setListActive = (location, active) => {
        const key = locationKey(location);
        [...locationsElement.children].forEach((item) => {
          if (item.dataset.locationKey === key) {
            item.classList.toggle('is-active', active);
          }
        });
      };

      const markers = layer.selectAll('g.visitor-map-marker')
        .data(locations.slice().reverse())
        .join('g')
        .attr('class', 'visitor-map-marker')
        .attr('transform', (location) => {
          const point = projection([Number(location.lon), Number(location.lat)]) || [-100, -100];
          return `translate(${point[0]},${point[1]})`;
        })
        .attr('tabindex', 0)
        .attr('role', 'img')
        .attr('aria-label', (location) => `${locationTitle(location)}, ${locationSubtitle(location)}: ${Number(location.count) || 0} visitors`)
        .on('pointerenter focus', (event, location) => {
          showTooltip(event, location);
          setListActive(location, true);
        })
        .on('pointerleave blur', (event, location) => {
          tooltipElement.hidden = true;
          setListActive(location, false);
        });

      markers.append('circle')
        .attr('class', 'visitor-map-halo')
        .attr('r', (location) => radius(Number(location.count) || 1) + 5);
      markers.append('circle')
        .attr('class', 'visitor-map-point')
        .attr('r', (location) => radius(Number(location.count) || 1));

      const markerNodes = markers.nodes();
      [...locationsElement.children].forEach((item) => {
        const marker = markerNodes.find((node) => locationKey(node.__data__) === item.dataset.locationKey);
        if (!marker) {
          return;
        }
        const toggle = (active) => marker.classList.toggle('is-active', active);
        item.addEventListener('pointerenter', () => toggle(true));
        item.addEventListener('pointerleave', () => toggle(false));
        item.addEventListener('focus', () => toggle(true));
        item.addEventListener('blur', () => toggle(false));
      });
    };

    const loadMapWhenNear = (locations) => {
      const load = async () => {
        try {
          const [, worldResponse] = await Promise.all([
            loadD3(),
            fetch('vendor/world-110m.geojson?v=20260828.1', { cache: 'force-cache' })
          ]);
          if (!worldResponse.ok) {
            throw new Error('World map unavailable');
          }
          renderMap(await worldResponse.json(), locations);
          statusElement.hidden = true;
        } catch (_) {
          statusElement.replaceChildren();
          statusElement.textContent = 'Visitor map is temporarily unavailable.';
        }
      };

      if (!('IntersectionObserver' in window)) {
        load();
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }
        observer.disconnect();
        load();
      }, { rootMargin: '500px 0px' });
      observer.observe(mapElement);
    };

    fetch(endpoint, {
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Visitor service unavailable');
        }
        return response.json();
      })
      .then((data) => {
        if (!data.ok) {
          throw new Error('Visitor service unavailable');
        }
        const locations = Array.isArray(data.locations) ? data.locations : [];
        setStat('total', data.uniqueVisitors);
        setStat('today', data.todayVisitors);
        setStat('countries', data.countries);
        renderLocationList(locations);
        noteElement.textContent = 'Approximate locations · The map database stores no raw IP addresses';
        loadMapWhenNear(locations);
      })
      .catch(() => {
        statusElement.replaceChildren();
        statusElement.textContent = 'Visitor activity is temporarily unavailable.';
        locationsElement.replaceChildren();
        const empty = document.createElement('li');
        empty.className = 'visitor-location-empty';
        empty.textContent = 'Please check back later.';
        locationsElement.appendChild(empty);
        noteElement.textContent = 'Privacy-friendly visitor statistics';
      });
  }
})();
