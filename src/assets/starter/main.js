(function () {
  const codeLanguageAliases = {
    cmd: 'batch',
    htm: 'markup',
    html: 'markup',
    md: 'markdown',
    njk: 'twig',
    nunjucks: 'twig',
    pseudocode: 'text',
    ps1: 'powershell',
    sh: 'bash',
    shell: 'bash',
    svg: 'markup',
    txt: 'text',
    xml: 'markup',
    yml: 'yaml'
  };

  const normalizeCodeLanguage = (value) => {
    if (!value) return '';
    const key = String(value).trim().toLowerCase();
    return codeLanguageAliases[key] || key;
  };

  const getDeclaredCodeLanguage = (code, pre) => {
    const explicit = [
      code.getAttribute('language'),
      code.getAttribute('data-language'),
      pre ? pre.getAttribute('language') : '',
      pre ? pre.getAttribute('data-language') : ''
    ];

    for (const value of explicit) {
      if (value) return value;
    }

    const classes = [
      ...(pre ? Array.from(pre.classList) : []),
      ...Array.from(code.classList)
    ];

    for (const className of classes) {
      if (className.startsWith('language-')) {
        return className.slice('language-'.length);
      }

      if (className.startsWith('lang-')) {
        return className.slice('lang-'.length);
      }
    }

    return '';
  };

  const normalizeCodeBlocks = () => {
    if (!window.Prism || typeof window.Prism.highlightElement !== 'function') return;

    document.querySelectorAll('pre code').forEach((code) => {
      const pre = code.parentElement;
      const normalized = normalizeCodeLanguage(getDeclaredCodeLanguage(code, pre));

      if (normalized) {
        code.classList.add(`language-${normalized}`);
        if (pre) pre.classList.add(`language-${normalized}`);
        code.dataset.language = normalized;
      }

      if (!code.querySelector('.token')) {
        window.Prism.highlightElement(code);
      }
    });
  };

  const bar = document.getElementById('progress-bar');
  let scrollTimeout;

  const onScroll = () => {
    if (!bar) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }, 10);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const darkToggle = document.getElementById('dark-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const setToggleUI = (isDark) => {
    if (!darkToggle) return;
    darkToggle.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
    darkToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    darkToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  };

  const applyTheme = (isDark) => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setToggleUI(isDark);
  };

  const savedTheme = localStorage.getItem('theme');
  const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark.matches;
  applyTheme(initialDark);

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      applyTheme(!document.documentElement.classList.contains('dark'));
    });
  }

  const fontInc = document.getElementById('font-inc');
  const fontDec = document.getElementById('font-dec');
  const contrastToggle = document.getElementById('contrast-toggle');
  const motionToggle = document.getElementById('motion-toggle');

  const setPressedState = (button, enabled, label) => {
    if (!button) return;
    button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    button.setAttribute('title', enabled ? `${label} enabled` : `${label} disabled`);
    button.classList.toggle('bg-purple-600', enabled);
    button.classList.toggle('border-purple-600', enabled);
    button.classList.toggle('text-white', enabled);
  };

  const applyA11y = () => {
    const size = parseFloat(localStorage.getItem('fontScale') || '1');
    const highContrast = localStorage.getItem('highContrast') === '1';
    const reduceMotion = localStorage.getItem('reduceMotion') === '1';

    requestAnimationFrame(() => {
      document.documentElement.style.setProperty('font-size', `${size * 100}%`);
      document.documentElement.classList.toggle('contrast', highContrast);
      document.documentElement.classList.toggle('reduce-motion', reduceMotion);

      setPressedState(contrastToggle, highContrast, 'Contrast');
      setPressedState(motionToggle, reduceMotion, 'Reduce motion');
    });
  };

  applyA11y();

  if (fontInc) {
    fontInc.addEventListener('click', () => {
      const size = Math.min(1.5, parseFloat(localStorage.getItem('fontScale') || '1') + 0.1);
      localStorage.setItem('fontScale', String(size));
      applyA11y();
    });
  }

  if (fontDec) {
    fontDec.addEventListener('click', () => {
      const size = Math.max(0.8, parseFloat(localStorage.getItem('fontScale') || '1') - 0.1);
      localStorage.setItem('fontScale', String(size));
      applyA11y();
    });
  }

  if (contrastToggle) {
    contrastToggle.addEventListener('click', () => {
      const next = localStorage.getItem('highContrast') === '1' ? '0' : '1';
      localStorage.setItem('highContrast', next);
      applyA11y();
    });
  }

  if (motionToggle) {
    motionToggle.addEventListener('click', () => {
      const next = localStorage.getItem('reduceMotion') === '1' ? '0' : '1';
      localStorage.setItem('reduceMotion', next);
      applyA11y();
    });
  }

  const hamburger = document.getElementById('hamburger');
  const primaryNav = document.getElementById('primary-nav');

  if (hamburger && primaryNav) {
    hamburger.setAttribute('aria-expanded', primaryNav.classList.contains('hidden') ? 'false' : 'true');
    hamburger.addEventListener('click', () => {
      const isHidden = primaryNav.classList.toggle('hidden');
      hamburger.classList.toggle('open', !isHidden);
      hamburger.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
    });
  }

  const a11yToggle = document.getElementById('a11y-toggle');
  const a11yMenu = document.getElementById('a11y-menu');

  if (a11yToggle && a11yMenu) {
    const closeMenu = () => {
      a11yMenu.classList.add('hidden');
      a11yToggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      a11yMenu.classList.remove('hidden');
      a11yToggle.setAttribute('aria-expanded', 'true');
    };

    a11yToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      if (a11yMenu.classList.contains('hidden')) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    document.addEventListener('click', (event) => {
      if (a11yMenu.classList.contains('hidden')) return;
      const within = a11yMenu.contains(event.target) || a11yToggle.contains(event.target);
      if (!within) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const fontToggle = document.getElementById('font-toggle');

  if (fontToggle) {
    const applyFontPref = (enabled) => {
      document.documentElement.classList.toggle('system-fonts', enabled);
      fontToggle.textContent = enabled ? 'Web Fonts' : 'System Fonts';
      fontToggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    };

    fontToggle.addEventListener('click', () => {
      const next = !document.documentElement.classList.contains('system-fonts');
      applyFontPref(next);
      localStorage.setItem('systemFonts', next ? '1' : '0');
    });

    applyFontPref(localStorage.getItem('systemFonts') === '1');
  }

  normalizeCodeBlocks();
})();
