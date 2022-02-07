# List of external routes

## Global query parameters

All external routes support the following query parameters:

**`format = image`**

If value is `image` (default) it generates a png images from the url. This is the only supported value

**`force = true | 1 | <empty>`**

If value is `true` or `1` it will bypass the image cache and force a new screenshot. Only applicable if format is `image`.


## `/external/zadrugator-map`

Definition: [src/views/parlameter/Generic.vue](../server/external-routes.js#L11)

This route has a defined max cache time as 30 minutes. If the cached image is older it will automatically create a new one.

Extra supported query parameters:

**None**
