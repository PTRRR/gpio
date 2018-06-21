<template lang="pug">
  .input-container.switch-button(
    ref='button'
    @click='click'
  )
    .button
      .slider(:class='{on}')
        .section.red
        .section.green
        .cursor
    h5.label(
      v-if='label'
    ) {{label}}
</template>

<script>
import BaseActuatorMixin from '@/mixins/BaseActuatorMixin'
import Hammer from 'hammerjs'

export default {
  name: 'SwitchButton',
  mixins: [BaseActuatorMixin],
  data () {
    return {
      type: 'bool',
      on: false
    }
  },
  methods: {
    click () {
      this.on = !this.on
      this.input()
    },
    input () {
      this.emit(this.on)
    }
  },
  mounted () {
    const { button } = this.$refs
    const buttonManager = new Hammer.Manager(button)
    const Swipe = new Hammer.Swipe()
    buttonManager.add(Swipe)

    buttonManager.on('swipe', e => {
      const { offsetDirection } = e
      if (offsetDirection === 8) {
        this.on = true
        this.input()
      } else if (offsetDirection === 16) {
        this.on = false
        this.input()
      }
    })
  }
}
</script>

<style lang="sass">
.switch-button
  flex: 0 1 auto !important
  width: 25%
  cursor: pointer
  .button
    flex: 1 1 auto
    width: 100%
    display: flex
    flex-flow: column
    position: relative
    border-radius: 10px
    position: relative
    overflow: hidden
    transform: translate3d(0, 0, 0)
    .slider
      position: absolute
      height: 200%
      width: 100%
      will-change: transform
      transform: translate(0, -10%)
      transition: transform 0.15s ease-in-out
      &.on
        transform: translate(0, -40.5%)
      .section
        width: 100%
        height: 50%
        position: relative
        border-radius: 10px
        &.red
          background: #FF2A43
        &.green
          background: #04FC3E
        h4
          margin: 0
          position: absolute
          left: 50%
          top: 50%
          transform: translate(-50%, -50%)
          font-family: Helvetica, Arial
          color: red
      .cursor
        position: absolute
        border-radius: 10px
        box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.1)
        width: 100%
        height: 20%
        background: white
        top: 50%
        left: 0
        transform: translate(0, -50%)
</style>
