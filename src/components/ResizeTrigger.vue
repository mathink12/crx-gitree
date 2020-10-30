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
import { debounce } from 'lodash'
import { getDefaultScrollbarWidth } from '@/utils/dom'

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
      left: this.value - this.width / 2,
      canMove: false,
      deltaX: 0, // 鼠标按下时距离触发器左边的距离
      scrollbarWidth: 0
    }
  },
  mounted () {
    this.scrollbarWidth = getDefaultScrollbarWidth()

    const debouncedMousemove = debounce(this.onMousemove)

    window.addEventListener('mousemove', debouncedMousemove, false)
    window.addEventListener('mouseup', this.onMouseup, false)

    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('mousemove', debouncedMousemove)
      window.removeEventListener('mouseup', this.onMouseup)
    })
  },
  methods: {
    onMousedown (e) {
      this.deltaX = e.clientX - this.left
      this.canMove = true
      document.body.style.userSelect = 'none'
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

      this.left = left - this.width / 2
      this.$emit('input', left)
    },
    onMouseup (e) {
      this.canMove = false
      document.body.style.userSelect = ''
    }
  }
}
</script>

<style lang="scss">
.resize-trigger {
  background: rgba(212, 212, 212, .5);
  // background: transparent;
  cursor: col-resize;
  position: fixed;
  top: 0px;
  bottom: 0px;
}
</style>
