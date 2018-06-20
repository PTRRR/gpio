<template lang="pug">
  .input-container.switch-button(
    @click='input'
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
    overflow: hidden
    .slider
      position: absolute
      height: 200%
      width: 100%
      transform: translate(0, -10%)
      transition: transform 0.15s ease-in-out
      &.on
        transform: translate(0, -40%)
      .section
        width: 100%
        height: 50%
        position: relative
        border-radius: 10px
        &.red
          background: #ff435d
        &.green
          background: #70e970
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
