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
  const token = window.location.hash.slice(1);
  const tokenLooksValid = /^[A-Za-z0-9_-]{40,64}$/.test(token);

  if (!tokenLooksValid) {
    button.disabled = true;
    status.textContent = 'This confirmation link is invalid or incomplete. Return to the signup page for a fresh link.';
    status.dataset.kind = 'error';
  } else {
    button.addEventListener('click', async () => {
      button.disabled = true;
      label.textContent = 'Confirming…';
      status.textContent = '';

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
          window.location.assign(
            result.code === 'invalid'
              ? '/newsletter/confirmed/?status=invalid'
              : '/newsletter/confirmed/?status=error'
          );
          return;
        }

        window.location.assign(result.redirect || '/newsletter/confirmed/');
      } catch {
        window.location.assign('/newsletter/confirmed/?status=error');
      }
    });
  }
}
