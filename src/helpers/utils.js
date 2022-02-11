const allowedDomains = [
  { domain: 'parlameter.si' },
  { domain: 'parlametar.hr' },
  { domain: 'scw.cloud', path: '/parlameter/' },
  { domain: 'djnd.si' },
];

const isAllowedUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return allowedDomains.some(
      ({ domain, path }) =>
        (url.hostname === domain || url.hostname.endsWith(`.${domain}`)) &&
        (!path || url.pathname.startsWith(path))
    );
  } catch (errpr) {
    return false;
  }
};

// eslint-disable-next-line import/prefer-default-export
export { isAllowedUrl };
