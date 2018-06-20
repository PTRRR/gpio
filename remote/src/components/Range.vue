<template lang="pug">
  .input-container.range
    .slider(
      ref='slider'
    )
      .cursor(
        ref='cursor'
        :style='{left: `${percent}%`}'
        @mousedown='active = true'
        @touchstart='active = true'
      )
    h5.label(v-if='label') {{label}}
</template>

<script>
import BaseActuatorMixin from '@/mixins/BaseActuatorMixin'
export default {
  name: 'Range',
  mixins: [BaseActuatorMixin],
  data () {
    return {
      type: 'float',
      active: false,
      percent: 0,
      left: 0
    }
  },
  mounted () {
    // Mouse
    this.bus.$on('mousemove', e => {
      if (this.active) {
        this.updateCursor(e)
      }
    })

    this.bus.$on('mouseup', e => {
      this.active = false
    })

    // Touch
    this.bus.$on('touchmove', e => {
      if (this.active) {
        this.updateCursor(e)
      }
    })

    this.bus.$on('touchend', e => {
      this.active = false
    })
  },
  methods: {
    updateCursor (e) {
      const { slider, cursor } = this.$refs
      const { clientX, touches } = e
      const posX = clientX || touches[0].clientX
      const box = slider.getBoundingClientRect()
      const cursorBox = cursor.getBoundingClientRect()
      const { left, width } = box
      const cursorWidth = cursorBox.width
      this.percent = ((posX - left - cursorWidth * 0.5) / (width))
      this.left = this.clamp(this.percent * width, 0, width - cursorWidth)
      this.percent = (this.left / (width)) * 100
      const val = ((posX - left - cursorWidth * 0.5) / (width - cursorWidth)) * 100
      this.emit(this.clamp(val, 0, 100))
    }
  }
}
</script>

<style lang="sass">
.range
  width: 66.66%
  flex-flow: column
  .slider
    flex: 1 1 auto
    width: 100%
    position: relative
    border-radius: 10px
    background: rgb(210, 210, 210)
    overflow: hidden
    cursor: pointer
    .cursor
      position: absolute
      left: 0
      top: 0
      width: 20%
      height: 100%
      background: white
      box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.1)
      border-radius: 10px
</style>
