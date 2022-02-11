<template>
  <vertical-half class="dark-bg">
    <div class="circle-container">
      <div v-if="params.image" class="img">
        <img :src="params.image" />
      </div>
      <div v-else-if="params.icon" class="img img--icon">
        <img :src="params.icon" />
      </div>
      <div v-else-if="params.acronym" class="img img--acronym">
        <span>{{ params.acronym }}</span>
      </div>
    </div>
    <div class="caption">
      <h1 class="caption__heading">
        {{ params.h1 }}
      </h1>
      <h2 class="caption__subheading">
        {{ params.h2 }}
      </h2>
    </div>
  </vertical-half>
  <vertical-half>
    <h2 class="title-text">
      {{ params.title }}
    </h2>
    <div class="logo-container">
      <div class="logo" />
    </div>
  </vertical-half>
</template>

<script>
import VerticalHalf from '@/components/VerticalHalf.vue';
import { isAllowedUrl } from '@/helpers/utils.js';

export default {
  name: 'Circle',
  components: {
    VerticalHalf,
  },
  data() {
    const { title, h1, h2, icon, image, acronym } = this.$route.query;
    const safeIcon = isAllowedUrl(icon) ? icon : '';
    const safeImage = isAllowedUrl(image) ? image : '';
    return {
      params: {
        title: title ?? '',
        h1: h1 ?? '',
        h2: h2 ?? '',
        icon: safeIcon ?? '',
        image: safeImage ?? '',
        acronym: acronym ?? '',
      },
    };
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto:500,700&subset=latin,latin-ext');
@import url('https://fonts.googleapis.com/css?family=Roboto+Slab:300&subset=latin,latin-ext');
@import '@/assets/parlameter-themes';
</style>

<style lang="scss" scoped>
.dark-bg {
  background-color: var(--background-accent);
}

.circle-container {
  margin-top: 20px;

  .img {
    display: block;
    margin: 0 auto;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 5px solid var(--text-light);
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      overflow: hidden;
    }

    &.img--icon {
      border: none;
      border-radius: 0;

      img {
        object-fit: contain;
        filter: brightness(0%) invert(100%);
      }
    }

    &.img--acronym {
      border: none;
      border-radius: 0;
      display: flex;
      width: 100%;

      span {
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        color: var(--text-light);
        text-align: center;
        font-size: 85px;
        line-height: 1;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

.caption {
  margin-top: auto;
  text-align: center;

  .caption__heading,
  .caption__subheading {
    color: var(--text-light);
    line-height: 1.2;
    margin: 0;
  }

  .caption__heading {
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 44px;
    margin-bottom: 10px;
  }

  .caption__subheading {
    font-family: 'Roboto Slab', sans-serif;
    font-weight: 300;
    font-size: 28px;
  }
}

.title-text {
  font-family: 'Roboto', sans-serif;
  text-align: center;
  font-size: 48px;
  color: var(--text-dark);
  flex: 1;
  margin-bottom: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-container {
  margin-top: auto;
  width: 100%;

  .logo {
    background-image: var(--logo-url);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    height: 100px;
  }
}
</style>
