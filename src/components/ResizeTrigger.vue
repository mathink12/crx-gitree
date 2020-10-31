<template>
  <div ref="trigger" class="resize-trigger"
    :style="{
      width: `${width}px`,
      left: `${left}px`,
      zIndex
    }"
    @mousedown.stop="onMousedown">
  </div>
</template>

<script>
import { throttle } from 'lodash'
import { getPropVal, getDefaultScrollbarWidth } from '@/utils/dom'

export default {
  name: 'ResizeTrigger',
  props: {
    value: {
      type: Number,
      default: 20
    },
    width: {
      type: Number,
      default: 8
    },
    minLeft: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number,
      default: 2020
    }
  },
  data () {
    return {
      left: this.value,
      canMove: false,
      deltaX: 0, // 鼠标按下时距离触发器左边的距离
      scrollbarWidth: 0,
      htmlStyle: {
        cursor: '',
        userSelect: ''
      }
    }
  },
  mounted () {
    this.scrollbarWidth = getDefaultScrollbarWidth()

    const throttledMousemove = throttle(this.onMousemove, 100, {
      trailing: true
    })

    window.addEventListener('mousemove', throttledMousemove, false)
    window.addEventListener('mouseup', this.onMouseup, false)

    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('mousemove', throttledMousemove)
      window.removeEventListener('mouseup', this.onMouseup)
    })
  },
  methods: {
    onMousedown (e) {
      this.deltaX = e.clientX - this.left
      this.canMove = true
      this.$emit('resize-ready')

      const html = document.documentElement
      // 缓存原来的样式
      this.htmlStyle = {
        cursor: getPropVal(html, 'cursor'),
        userSelect: getPropVal(html, 'user-select')
      }
      html.style.cursor = 'col-resize'
      html.style.userSelect = 'none'
    },
    onMousemove (e) {
      if (!this.canMove) return
      console.log(e.clientX)

      let left = e.clientX - this.deltaX
      const maxLeft = window.innerWidth - this.width - this.scrollbarWidth
      if (left < this.minLeft) {
        left = this.minLeft
      } else if (left > maxLeft) {
        left = maxLeft
      }

      this.left = left
      this.$emit('input', left)
    },
    onMouseup (e) {
      this.canMove = false
      this.$emit('resize-done')

      const { cursor, userSelect } = this.htmlStyle
      const html = document.documentElement
      html.style.cursor = cursor
      html.style.userSelect = userSelect
    }
  }
}
</script>

<style lang="scss">
.resize-trigger {
  // background: rgba(212, 212, 212, .5);
  background: transparent;
  cursor: col-resize;
  position: fixed;
  top: 0px;
  bottom: 0px;
}
</style>
