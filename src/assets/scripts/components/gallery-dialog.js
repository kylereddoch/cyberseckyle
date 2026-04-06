const modals = Array.from(document.querySelectorAll('dialog'));
const openButtons = document.querySelectorAll('button[data-index]');

openButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    modals[index]?.showModal();
    modals[index]?.focus();
  });
});

modals.forEach((modal, index) => {
  const closeBtn = modal.querySelector('button[data-close]');
  const prevBtn = modal.querySelector('button[data-nav="prev"]');
  const nextBtn = modal.querySelector('button[data-nav="next"]');

  closeBtn?.addEventListener('click', () => modal.close());

  prevBtn?.addEventListener('click', () => {
    modal.close();
    const prev = modals[(index - 1 + modals.length) % modals.length];
    prev?.showModal();
    prev?.focus();
  });

  nextBtn?.addEventListener('click', () => {
    modal.close();
    const next = modals[(index + 1) % modals.length];
    next?.showModal();
    next?.focus();
  });

  modal.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      modal.close();
      const next = modals[(index + 1) % modals.length];
      next?.showModal();
      next?.focus();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      modal.close();
      const prev = modals[(index - 1 + modals.length) % modals.length];
      prev?.showModal();
      prev?.focus();
    }
  });

  let startX = 0;
  let endX = 0;

  modal.addEventListener('touchstart', event => {
    if (event.touches.length > 1) return;
    startX = event.touches[0].screenX;
  });

  modal.addEventListener('touchend', event => {
    if (event.changedTouches.length > 1) return;
    endX = event.changedTouches[0].screenX;
    const diff = endX - startX;
    if (Math.abs(diff) < 50) return;

    modal.close();
    const target =
      diff > 0
        ? modals[(index - 1 + modals.length) % modals.length]
        : modals[(index + 1) % modals.length];

    target?.showModal();
    target?.focus();
  });
});

window.addEventListener('click', event => {
  modals.forEach(modal => {
    if (event.target === modal) modal.close();
  });
});
