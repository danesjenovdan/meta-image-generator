const isAllowedDomain = (url, allowedDomains = []) => {
  try {
    const urlObj = new URL(url);
    return allowedDomains.some(
      (domain) =>
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );
  } catch (errpr) {
    return false;
  }
};

// eslint-disable-next-line import/prefer-default-export
export { isAllowedDomain };
