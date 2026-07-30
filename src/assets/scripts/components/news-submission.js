const submissionRoot = document.querySelector('[data-news-submission]');

if (submissionRoot) {
  const form = submissionRoot.querySelector('[data-news-submission-form]');
  const apiUrl = submissionRoot.dataset.newsletterApiUrl || '';

  if (form && apiUrl) {
    const submitButton = form.querySelector('[data-news-submission-submit]');
    const submitLabel = form.querySelector('[data-news-submission-submit-label]');
    const status = form.querySelector('[data-news-submission-status]');
    const originalLabel = submitLabel?.textContent || 'Send this signal';

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
        setStatus('Please complete the security check before submitting.', 'error');
        return;
      }

      submitButton.disabled = true;
      submitLabel.textContent = 'Sending signal…';

      try {
        const response = await fetch(`${apiUrl}/news/submit`, {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            headline: String(formData.get('headline') || ''),
            articleUrl: String(formData.get('article_url') || ''),
            source: String(formData.get('source') || ''),
            whyItMatters: String(formData.get('why_it_matters') || ''),
            category: String(formData.get('category') || ''),
            submitterName: String(formData.get('submitter_name') || ''),
            email: String(formData.get('email') || ''),
            creditPreference: String(formData.get('credit_preference') || ''),
            relationship: String(formData.get('relationship') || ''),
            disclosure: String(formData.get('disclosure') || ''),
            consent: formData.get('consent') === 'on',
            website: String(formData.get('website') || ''),
            turnstileToken
          })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || 'The submission could not be completed. Please try again.');
        }

        window.location.assign('/submit-news/thanks/');
      } catch (error) {
        setStatus(
          error.message || 'The submission could not be completed. Please try again.',
          'error'
        );
        if (window.turnstile) window.turnstile.reset();
      } finally {
        submitButton.disabled = false;
        submitLabel.textContent = originalLabel;
      }
    });
  }
}
