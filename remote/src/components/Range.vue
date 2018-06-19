<template lang="pug">
  .range
    .slider(
      ref='slider'
      @mousedown='active = true'
    )
      .cursor(
        ref='cursor'
        :style='{left: `${percent}%`}'
      )
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
    this.bus.$on('mousemove', e => {
      if (this.active) {
        this.updateCursor(e)
      }
    })

    this.bus.$on('mouseup', e => {
      this.active = false
    })

    this.bus.$on('resize', e => {

    })
  },
  methods: {
    updateCursor (e) {
      const { slider, cursor } = this.$refs
      const { clientX } = e
      const box = slider.getBoundingClientRect()
      const cursorBox = cursor.getBoundingClientRect()
      const { left, width } = box
      const cursorWidth = cursorBox.width
      this.percent = ((clientX - left - cursorWidth * 0.5) / (width))
      this.left = this.clamp(this.percent * width, 0, width - cursorWidth)
      this.percent = (this.left / (width)) * 100
      const val = ((clientX - left - cursorWidth * 0.5) / (width - cursorWidth)) * 100
      this.emit(this.clamp(val, 0, 100))
    }
  }
}
</script>

<style lang="sass">
.range
  flex: 1 1 auto
  width: 50%
  height: 100%
  padding: 20px
  .slider
    width: 100%
    height: 100%
    position: relative
    border-radius: 10px
    background: rgb(210, 210, 210)
    overflow: hidden
    cursor: pointer
    .cursor
      position: absolute
      left: 0
      top: 0
      width: 15%
      height: 100%
      background: white
      box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.1)
      border-radius: 10px
</style>
