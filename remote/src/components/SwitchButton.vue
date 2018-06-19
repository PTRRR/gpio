<template lang="pug">
  .switch-button(
    @click='input'
  )
    .button
      .slider(:class='{on}')
        .section.red
        .section.green
        .cursor
</template>

<script>
import BaseActuatorMixin from '@/mixins/BaseActuatorMixin'
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
    input () {
      this.on = !this.on
      this.emit(this.on)
    }
  }
}
</script>

<style lang="sass">
.switch-button
  width: 20%
  height: 100%
  padding: 20px
  cursor: pointer
  .button
    width: 100%
    height: 100%
    display: flex
    flex-flow: column
    position: relative
    border-radius: 10px
    overflow: hidden
    .slider
      position: absolute
      height: 200%
      width: 100%
      transform: translate(0, -16%)
      transition: transform 0.15s ease-in-out
      &.on
        transform: translate(0, -34%)
      .section
        width: 100%
        height: 50%
        border-radius: 10px
        &.red
          background: #ff435d
        &.green
          background: #70e970
      .cursor
        position: absolute
        border-radius: 10px
        box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.1)
        width: 100%
        height: 33%
        background: white
        top: 50%
        left: 0
        transform: translate(0, -50%)
</style>
