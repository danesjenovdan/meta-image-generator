<template>
  <div class="vertical-half">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'VerticalHalf',
};
</script>

<style lang="scss" scoped>
.vertical-half {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-basis: 50%;
  padding: 55px 35px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
