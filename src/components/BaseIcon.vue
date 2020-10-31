<template>
  <svg class="gitreefont" aria-hidden="true">
    <use :xlink:href="`#${fontName}`"></use>
  </svg>
</template>

<script>
export default {
  name: 'BaseIcon',
  props: {
    // gitree-gitee
    name: String
  },
  computed: {
    fontName () {
      const { name } = this
      if (name.startsWith('gitree-')) return name

      return `gitree-${name}`
    }
  }
}
</script>

<style lang="scss">
.gitreefont {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  font-size: 20px;
}
</style>
