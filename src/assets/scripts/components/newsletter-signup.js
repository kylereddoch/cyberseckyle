const signupRoot = document.querySelector('[data-newsletter-signup]');

if (signupRoot) {
  const form = signupRoot.querySelector('[data-newsletter-form]');
  const apiUrl = signupRoot.dataset.newsletterApiUrl || '';

  if (form && apiUrl) {
    const submitButton = form.querySelector('[data-newsletter-submit]');
    const submitLabel = form.querySelector('[data-newsletter-submit-label]');
    const status = form.querySelector('[data-newsletter-status]');
    const originalLabel = submitLabel?.textContent || 'Send my confirmation';

    const setStatus = (message, kind = '') => {
      status.textContent = message;
      status.dataset.kind = kind;
    };

    form.addEventListener('submit', async event => {
      event.preventDefault();
      setStatus('');

      if (!form.reportValidity()) return;

      const formData = new FormData(form);
      const turnstileToken = String(formData.get('cf-turnstile-response') || '');

      if (!turnstileToken) {
        setStatus('Please complete the security check before subscribing.', 'error');
        return;
      }

      submitButton.disabled = true;
      submitLabel.textContent = 'Sending confirmation…';

      try {
        const response = await fetch(`${apiUrl}/newsletter/subscribe`, {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email: String(formData.get('email') || ''),
            firstName: String(formData.get('first_name') || ''),
            consent: formData.get('consent') === 'on',
            website: String(formData.get('website') || ''),
            signupPath: window.location.pathname,
            turnstileToken
          })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || 'The signup could not be completed. Please try again.');
        }

        window.location.assign('/newsletter/check-your-email/');
      } catch (error) {
        setStatus(error.message || 'The signup could not be completed. Please try again.', 'error');
        if (window.turnstile) window.turnstile.reset();
      } finally {
        submitButton.disabled = false;
        submitLabel.textContent = originalLabel;
      }
    });
  }
}

const confirmationRoot = document.querySelector('[data-newsletter-confirmation]');

if (confirmationRoot) {
  const state = new URLSearchParams(window.location.search).get('status') || 'success';
  const heading = confirmationRoot.querySelector('[data-confirmation-heading]');
  const kicker = confirmationRoot.querySelector('[data-confirmation-kicker]');
  const message = confirmationRoot.querySelector('[data-confirmation-message]');
  const icon = confirmationRoot.querySelector('[data-confirmation-icon]');
  const success = confirmationRoot.querySelector('[data-confirmation-success]');
  const invalid = confirmationRoot.querySelector('[data-confirmation-invalid]');
  const error = confirmationRoot.querySelector('[data-confirmation-error]');

  message.hidden = true;
  success.hidden = true;
  invalid.hidden = true;
  error.hidden = true;

  if (state === 'invalid') {
    kicker.textContent = 'Confirmation link';
    heading.textContent = 'This link cannot be used';
    icon.textContent = '⚠️';
    invalid.hidden = false;
  } else if (state === 'error') {
    kicker.textContent = 'Temporary problem';
    heading.textContent = 'Confirmation did not finish';
    icon.textContent = '🛠️';
    error.hidden = false;
  } else {
    kicker.textContent = 'Subscription active';
    heading.textContent = 'Welcome to the dispatch';
    icon.textContent = '🛡️';
    success.hidden = false;
  }
}

const confirmRoot = document.querySelector('[data-newsletter-confirm]');

if (confirmRoot) {
  const apiUrl = confirmRoot.dataset.newsletterApiUrl || '';
  const button = confirmRoot.querySelector('[data-newsletter-confirm-button]');
  const label = confirmRoot.querySelector('[data-newsletter-confirm-label]');
  const status = confirmRoot.querySelector('[data-newsletter-confirm-status]');
  const heading = confirmRoot.querySelector('[data-newsletter-confirm-heading]');
  const kicker = confirmRoot.querySelector('[data-newsletter-confirm-kicker]');
  const icon = confirmRoot.querySelector('[data-newsletter-confirm-icon]');
  const token = window.location.hash.slice(1);
  const tokenLooksValid = /^[A-Za-z0-9_-]{40,64}$/.test(token);

  if (!tokenLooksValid) {
    button.disabled = true;
    button.hidden = true;
    kicker.textContent = 'Confirmation link';
    heading.textContent = 'This link cannot be used';
    icon.textContent = '⚠️';
    status.textContent = 'This confirmation link is invalid or incomplete. Return to the signup page for a fresh link.';
    status.dataset.kind = 'error';
  } else {
    let confirmationInProgress = false;

    const confirmSubscription = async () => {
      if (confirmationInProgress) return;
      confirmationInProgress = true;
      button.disabled = true;
      button.hidden = true;
      label.textContent = 'Try confirmation again';
      kicker.textContent = 'Secure confirmation';
      heading.textContent = 'Confirming your subscription…';
      icon.textContent = '🛡️';
      status.textContent = 'This should only take a moment.';
      status.dataset.kind = '';

      try {
        const response = await fetch(`${apiUrl}/newsletter/confirm`, {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json'
          },
          body: JSON.stringify({ token })
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (result.code === 'invalid') {
            window.location.replace('/newsletter/confirmed/?status=invalid');
            return;
          }

          throw new Error(result.message || 'The confirmation could not be completed.');
        }

        window.location.replace(result.redirect || '/newsletter/confirmed/');
      } catch {
        confirmationInProgress = false;
        kicker.textContent = 'Temporary problem';
        heading.textContent = 'Confirmation did not finish';
        icon.textContent = '🛠️';
        status.textContent = 'Your secure link is still available. Check your connection, then try again.';
        status.dataset.kind = 'error';
        button.disabled = false;
        button.hidden = false;
      }
    };

    button.addEventListener('click', confirmSubscription);

    const startConfirmation = () => {
      if (document.visibilityState === 'hidden') {
        document.addEventListener(
          'visibilitychange',
          () => {
            if (document.visibilityState === 'visible') confirmSubscription();
          },
          { once: true }
        );
        return;
      }

      confirmSubscription();
    };

    startConfirmation();
  }
}
