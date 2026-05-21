<template>
  <div class="hamburger-container" @click="toggleClick">
    <i :class="{'is-active': isActive}" class="hamburger-icon el-icon-s-fold"></i>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.hamburger-container {
  padding: 0 15px;
  display: inline-block;
  cursor: pointer;
  transition: background 0.3s;
  height: 100%;
  
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
  
  .hamburger-icon {
    width: 20px;
    display: inline-block;
    font-size: 20px;
    
    &.is-active {
      transform: rotate(180deg);
    }
  }
}
</style> 