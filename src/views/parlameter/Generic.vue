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
  position: relative;
  z-index: 0;

  &::before,
  &::after {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    z-index: -1;
  }

  &::before {
    background-image: var(--bg-url);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 0.25;
    filter: grayscale(1) blur(3px);
  }

  &::after {
    background: var(--background-accent);
    mix-blend-mode: multiply;
  }
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
