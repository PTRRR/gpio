<template lang='pug'>
  #app(ref='app')
    .row
      range(
        @input='onInput'
        :pin='10'
      )
      switch-button(
        @input='onInput'
        :pin='1'
      )
    .row
      switch-button(
        @input='onInput'
        :pin='1'
      )
      switch-button(
        @input='onInput'
        :pin='1'
      )
      switch-button(
        @input='onInput'
        :pin='1'
      )
    .row
      switch-button(
        @input='onInput'
        :pin='1'
      )
      switch-button(
        @input='onInput'
        :pin='1'
      )
      switch-button(
        @input='onInput'
        :pin='1'
      )
    .row
      switch-button(
        @input='onInput'
        :pin='1'
      )
      switch-button(
        @input='onInput'
        :pin='1'
      )
      switch-button(
        @input='onInput'
        :pin='1'
      )
    .row
      switch-button(
        @input='onInput'
        :pin='1'
      )
      switch-button(
        @input='onInput'
        :pin='1'
      )
      switch-button(
        @input='onInput'
        :pin='1'
      )
</template>

<script>
import SwitchButton from '@/components/SwitchButton'
import Range from '@/components/Range'
export default {
  name: 'App',
  components: { SwitchButton, Range },
  data () {
    return {
      socket: null,
      connected: false
    }
  },
  mounted () {
    const events = ['resize', 'click', 'mousemove', 'mousedown', 'mouseup']
    for (const event of events) {
      window.addEventListener(event, e => {
        this.bus.$emit(event, e)
      })
    }
    console.log(this)
    // console.log(WebSocket)
    if (window.WebSocket) {
      this.socket = new WebSocket('ws://localhost:1337')
      this.socket.onmessage = ({ data }) => {
        const msg = JSON.parse(data)
        const { type, message } = msg
        switch (type) {
          case 'connected':
            console.log('*********** SERVER CONNECTION ***********')
            this.connected = true
            break
          default:
            console.log(type, message)
            break
        }
      }
    } else {
      console.log('This browser doesn\'t support websocket')
    }
  },
  methods: {
    sendMessage (type, message) {
      if (this.socket && this.connected) {
        this.socket.send(JSON.stringify({type, message}))
      }
    },
    onInput ({ type, message }) {
      this.sendMessage(type, message)
    }
  }
}
</script>

<style lang='sass'>
*
  box-sizing: border-box
html, body
  width: 100%
  height: 100%
  margin: 0
#app
  display: flex
  flex-flow: column
  height: 100%
  background: rgb(230, 230, 230)
  .row
    flex: 1 1 auto
    display: flex
</style>
