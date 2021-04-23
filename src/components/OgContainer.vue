<template>
  <div id="og-container" :data-theme="$route.query?.theme || 'si'">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'OgContainer',
};
</script>

<style lang="scss" scoped>
#og-container {
  display: flex;
  position: relative;
  width: 1200px;
  height: 630px;
  background: var(--background-light, #fff);
  overflow: hidden;
}
</style>
