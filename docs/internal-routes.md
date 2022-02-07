# List of internal routes

## Global query parameters

All internal routes support the following query parameters:

**`format = image | html`**

If value is `image` (default) it generates a png images from the template. If value is `html` is returns the rendered template itself as a web page.

**`force = true | 1 | <empty>`**

If value is `true` or `1` it will bypass the image cache and force a new screenshot. Only applicable if format is `image`.


## `/parlameter/generic`

View component: [src/views/parlameter/Generic.vue](../src/views/parlameter/Generic.vue)

Extra supported query parameters:

**`title = <string>`** - Title text


## `/parlameter/circle`

View component: [src/views/parlameter/Circle.vue](../src/views/parlameter/Circle.vue)

Extra supported query parameters:

**`title = <string>`** - Title text

**`h1 = <string>`** - Primary text under image/icon

**`h2 = <string>`** - Secondary text under image/icon

**`image = <url> | <empty>`** - Absolute url to an image to be displayed in a circle (e.g. person portrait, like [this](https://cdn.nov.parlameter.si/v1/parlassets/img/people/square/P338.png))

**`icon = <url> | <empty>`** - Absolute url to an icon (e.g. session or legislation icon, like [this](https://cdn.nov.parlameter.si/v1/parlassets/icons/legislation/money.svg)) - only used if image is not defined

**`acronym = <string> | <empty>`** - Big text (e.g. party acronym like `SD` or `Levica`) - only used if both image and icon are not defined
