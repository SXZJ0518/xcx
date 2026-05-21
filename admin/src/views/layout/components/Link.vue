<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
export default {
  name: 'AppLink',
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    // 判断是内部链接还是外部链接
    isExternal() {
      return /^(https?:|mailto:|tel:)/.test(this.to)
    },
    // 根据链接类型返回组件类型
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    // 返回链接属性
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script> 