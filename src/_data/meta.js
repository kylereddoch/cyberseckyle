export const url = process.env.URL || 'https://www.kylereddoch.me';
// Extract domain from `url`
export const domain = new URL(url).hostname;
export const siteName = 'CybersecKyle';
export const siteDescription = 'CybersecKyle is the personal site of Kyle Reddoch, a cybersecurity expert and IT professional sharing practical guides, incident lessons, everyday defense tips, and more.';
export const siteType = 'Person'; // schema
export const locale = 'en_EN';
export const lang = 'en';
export const skipContent = 'Skip to content';
export const author = {
  name: 'Kyle Reddoch', // i.e. Lene Saile - page / blog author's name. Must be set.
  avatar: '/assets/images/logo.png', // path to the author's avatar. In this case just using a favicon.
  email: 'kyle@kylereddoch.me', // i.e. email of the author
  website: 'https://www.kylereddoch.me', // i.e. https.://www.lenesaile.com - the personal site of the author
  fediverse: '@cyberseckyle@infosec.exchange' // used for highlighting journalism on the fediverse. Can be Mastodon, Flipboard, Threads, WordPress (with the ActivityPub plugin installed), PeerTube, Pixelfed, etc. https://blog.joinmastodon.org/2024/07/highlighting-journalism-on-mastodon/
};
export const donate = {
  enabled: true, // set to false to hide the donate page and links
  kofi: "kylereddoch",
  buymeacoffee: "kylereddoch",
  github: "kylereddoch",
  message: "If you find value in my writing, consider supporting my work. Every contribution helps me continue creating thoughtful content."
};
export const creator = {
  name: 'Kyle Reddoch', // i.e. Lene Saile - creator's (developer) name.
  email: 'kyle@kylereddoch.me',
  website: 'https://www.kylereddoch.me',
  social: 'https://infosec.exchange/@cyberseckyle' // i.e. creator's social media account
};
export const analytics = {
  tinylytics: {
    siteCode: process.env.TINYLYTICS_SITE_CODE || 'aK6PBymtmDm6DxSXaP2H',
    publicId: process.env.TINYLYTICS_PUBLIC_ID || 'wgrU27nAtwqvZpx9zZwe'
  }
};
export const pathToSvgLogo = '/favicon.svg'; // used for favicon generation
export const themeColor = '#cba6f7'; // used in manifest, for example primary color value
export const themeDark = '#1e1e2e'; // used for meta tag theme-color, if dark colors are prefered. best use value set for dark bg
export const opengraph_default = '/assets/images/template/opengraph-default.jpg'; // fallback/default meta image
export const opengraph_default_alt =
  "CybersecKyle is the personal site of Kyle Reddoch, a cybersecurity expert and IT professional sharing practical guides, incident lessons, everyday defense tips, and more."; // alt text for default meta image"
export const blog = {
  // RSS feed
  name: 'CybersecKyle',
  description: 'CybersecKyle is the personal site of Kyle Reddoch, a cybersecurity expert and IT professional sharing practical guides, incident lessons, everyday defense tips, and more.',
  // feed links are looped over in the head. You may add more to the array.
  feedLinks: [
    {
      title: 'Atom Feed',
      url: '/feed.xml',
      type: 'application/atom+xml'
    },
    {
      title: 'JSON Feed',
      url: '/feed.json',
      type: 'application/json'
    }
  ],
  // Tags
  tagSingle: '#',
  tagPlural: 'Post Tags',
  tagMore: '#',
  // pagination
  paginationLabel: 'Blog',
  paginationPage: 'Page',
  paginationPrevious: 'Previous',
  paginationNext: 'Next',
  paginationNumbers: true
};
export const details = {
  aria: 'section controls',
  expand: 'expand all',
  collapse: 'collapse all'
};
export const dialog = {
  close: 'Close',
  next: 'Next',
  previous: 'Previous'
};
export const navigation = {
  navLabel: 'Menu',
  ariaTop: 'Main',
  ariaBottom: 'Complementary',
  ariaPlatforms: 'Platforms',
  drawerNav: true,
  subMenu: false
};
export const viewRepo = {
  // this is for the view/edit on github link. The value in the package.json will be pulled in.
  allow: false,
  infoText: 'View this page on GitHub'
};
export const easteregg = false;
