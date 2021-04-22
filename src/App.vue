<template>
  <og-container>
    <router-view />
  </og-container>
</template>

<script>
import OgContainer from '@/components/OgContainer.vue';

export default {
  components: {
    OgContainer,
  },
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  background-color: #888;
  height: 100%;
}

#app {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
