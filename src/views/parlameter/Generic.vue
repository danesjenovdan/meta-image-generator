<template>
  <vertical-half class="image-bg">
    <h1>{{ params.title }}</h1>
  </vertical-half>
  <vertical-half>
    <div class="logo" />
  </vertical-half>
</template>

<script>
import VerticalHalf from '@/components/VerticalHalf.vue';

export default {
  name: 'ParlameterGeneric',
  components: {
    VerticalHalf,
  },
  data() {
    const { title } = this.$route.query;
    return {
      params: {
        title: title ?? '',
      },
    };
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto+Slab:700&subset=latin,latin-ext');
@import '@/assets/parlameter-themes';
</style>

<style lang="scss" scoped>
.image-bg {
  background-image: var(--bg-url);
}

h1 {
  font-family: 'Roboto Slab', sans-serif;
  font-size: 60px;
  color: var(--text-light);
  text-align: center;
}

.logo {
  background-image: var(--logo-url);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 100%;
  height: 180px;
}
</style>
