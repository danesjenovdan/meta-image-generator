Meta image generator
---

Generates images using puppeteer and headless chromium by taking screenshots of web pages. Used mainly for dynamic meta images (facebook og images and twitter images).

---

## How it works

Server supports generating images from html templates (internal routes) and urls (external routes).


### Internal routes

These are routes that are rendered from templates internally and take values from url query parameters.

Example url: https://meta-image-generator.lb.djnd.si/parlameter/generic?title=example+text

List of all internal routes is in [src/routes.js](./src/routes.js#L4) and documented [here](./docs/internal-routes.md).


### External routes

These are routes that generate image from an external url. All routes are prefixed with `/external/`.

Example url: https://meta-image-generator.lb.djnd.si/external/zadrugator-map

List of all external routes is in [server/external-routes.js](./server/external-routes.js#L10) and documented [here](./docs/external-routes.md).


### Caching

Generated images are cached based on their url.

Query parameters `format` and `force` are removed from the url before generating the cache key. All other query parameters and their order is preserved.

This means `?format=image&title=hello+there&h1=blah` and `?title=hello+there&h1=blah` are considered the same, but `?title=hello+there&h1=blah` and `?h1=blah&title=hello+there` are different.
