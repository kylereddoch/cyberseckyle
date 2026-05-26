export default [
  {
    name: 'Cybersecurity and Infosec',
    slug: 'cybersecurity',
    icon: '&#128737;&#65039;',
    accentColor: '#a855f7',
    description: 'Practical cybersecurity analysis, defensive lessons, incident response notes, and security writing from my day-to-day work.',
    intro: 'This is the broad cybersecurity lane: practical defender context, security analysis, and the posts that connect technical details back to real operational risk.',
    matchTags: ['cybersecurity', 'infosec', 'infosecurity', 'security', 'security-operations', 'threat-detection', 'threat-intelligence'],
    featuredUrls: [
      '/blog/the-biggest-cybersecurity-risk-for-smbs-still-isnt-the-fancy-stuff/',
      '/blog/cybersecurity-does-not-have-a-specialization-problem-it-has-a-context-problem/',
      '/blog/20-common-network-ports-you-must-know-and-secure/'
    ]
  },
  {
    name: 'MSP (Managed Services)',
    slug: 'msp-security',
    icon: '&#128188;',
    accentColor: '#3b82f6',
    description: 'Security guidance for MSPs and IT teams responsible for messy, real-world environments.',
    intro: 'MSP security lives in the gap between ideal security architecture and what actually happens across client endpoints, tools, alerts, budgets, and people.',
    matchTags: ['MSP', 'msp', 'risk-management', 'vulnerability-management', 'patch-management', 'endpoint-security', 'security-operations'],
    featuredUrls: [
      '/blog/managing-vulnerabilities-in-an-msp-environment/',
      '/blog/fighting-the-pup-wave-a-practical-powershell-cleanup-workflow-for-msps/',
      '/blog/your-help-desk-is-now-part-of-the-attack-surface/'
    ]
  },
  {
    name: 'IT',
    slug: 'it',
    icon: '&#128295;',
    accentColor: '#6366f1',
    description: 'Practical IT operations, troubleshooting, documentation, tools, and the day-to-day work that keeps systems usable.',
    intro: 'This is the broader IT lane: sysadmin work, network documentation, platform decisions, troubleshooting notes, and the practical connective tissue around security and support.',
    matchTags: ['IT', 'sysadmin', 'networking', 'documentation', 'diagrams', 'tech', 'apple', 'macos', 'ios', 'ipados'],
    featuredUrls: [
      '/blog/network-diagrams-are-boring-until-you-need-one/',
      '/blog/i-didnt-know-you-could-do-this-the-nvram-trick-that-saved-a-mac/',
      '/blog/apple-creator-studio-hit-my-nerd-buttons-and-yes-im-genuinely-excited/'
    ]
  },
  {
    name: 'Windows and PowerShell',
    slug: 'windows-powershell',
    icon: '&#128187;',
    accentColor: '#14b8a6',
    description: 'Windows troubleshooting, PowerShell workflows, endpoint cleanup, and practical admin scripts.',
    intro: 'These are the posts for Windows problems that need a real answer: PowerShell, endpoint management, strange alerts, cleanup work, and the little details that save time.',
    matchTags: ['windows', 'windows-11', 'powershell', 'scripts', 'intune', 'gpo'],
    featuredUrls: [
      '/blog/find-actual-drive-behind-windows-harddisk-error/',
      '/blog/fighting-the-pup-wave-a-practical-powershell-cleanup-workflow-for-msps/',
      '/blog/remove-preinstalled-microsoft-store-apps-in-windows-11-24h2-and-25h2/'
    ]
  },
  {
    name: 'Browser Security',
    slug: 'browser-security-privacy',
    icon: '&#128269;',
    accentColor: '#22c55e',
    description: 'Browser security, extension risk, privacy tradeoffs, and the browser as a modern security boundary.',
    intro: 'The browser is where people work, authenticate, store sessions, and increasingly run AI-assisted workflows. This hub collects the posts where I treat it like the security boundary it has become.',
    matchTags: ['browser-security', 'browser-privacy', 'browsers', 'extensions', 'vivaldi', 'privacy', 'ad-blocking'],
    featuredUrls: [
      '/blog/secure-browsers-push-zero-trust-past-the-login-screen/',
      '/blog/sleeper-browser-extensions-how-a-7-year-campaign-turned-chrome-and-edge-into-spyware/',
      '/blog/chromes-silent-gemini-nano-download-has-a-consent-problem/'
    ]
  },
  {
    name: 'AI',
    slug: 'ai-security',
    icon: '&#129504;',
    accentColor: '#f97316',
    description: 'Security analysis for AI tools, agentic systems, browser agents, and operational AI risk.',
    intro: 'AI security is not only model behavior. It is permissions, data access, tools, browser context, identity, workflow design, and all the places automation can quietly start taking action.',
    matchTags: ['ai', 'appsec', 'openai', 'security-tools', 'devsecops', 'browser-security'],
    featuredUrls: [
      '/blog/agentic-ai-is-securitys-next-blind-spot-because-it-can-act/',
      '/blog/claudes-chrome-extension-flaw-shows-why-agentic-browsing-needs-real-guardrails/',
      '/blog/openais-codex-security-and-gpt-54-cyber-could-be-a-big-deal-for-real-world-defenders/'
    ]
  },
  {
    name: 'Everyday Defense',
    slug: 'everyday-defense',
    icon: '&#128170;',
    accentColor: '#ec4899',
    description: 'Approachable security guidance for normal people, families, and small teams trying to stay safer without burning out.',
    intro: 'Everyday defense is the practical side of security: the habits, recovery plans, browser choices, backups, MFA decisions, and scam-spotting routines people can actually live with.',
    matchTags: ['cyberseckyle-howto-series', 'digital-safety', 'how-to', 'tutorials', 'privacy', 'passwords', 'mfa'],
    featuredUrls: [
      '/blog/cyberseckyle-security-how-to-series-everyday-defense-part-1-password-managers-mfa/',
      '/blog/cyberseckyle-security-how-to-series-everyday-defense-part-5-scam-spotting-the-60-second-pause-protocol/',
      '/blog/cyberseckyle-security-how-to-series-everyday-defense-part-6-backups-that-actually-restore/'
    ]
  }
];
