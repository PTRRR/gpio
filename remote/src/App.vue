<template lang='pug'>
  #app(
    ref='app'
    :class='{console}'
  )
    .pannels(:class='pannelsTranslationClass')
      .pannel(v-for='pannel in pannels')
        h5.pannel-label {{pannel.label}}
        .row(v-for='row in pannel.rows')
          component(
            v-for='(component, index) in row.components'
            @input='onInput'
            :key='index'
            :is='component.name'
            :pin='component.pin'
            :label='component.label'
        )
    .console-pannel
      .text-container
</template>

<script>
import SwitchButton from '@/components/SwitchButton'
import Range from '@/components/Range'
import MathMixin from '@/mixins/MathMixin'
import Hammer from 'hammerjs'
const interfaceTemplate = require('../static/interfaceTemplate')

export default {
  name: 'App',
  mixins: [MathMixin],
  components: { SwitchButton, Range },
  head: {
    title () {
      return {
        inner: 'GPIO'
      }
    },
    meta: [
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
    ]
  },
  data () {
    return {
      socket: null,
      connected: false,
      interfaceTemplate,
      pannelIndex: 0,
      console: false
    }
  },
  computed: {
    pannels () {
      return interfaceTemplate.pannels
    },
    pannelsTranslationClass () {
      return `pannel-${this.pannelIndex}`
    }
  },
  mounted () {
    // Handle events
    const events = {
      resize: {
        prevent: false
      },
      click: {
        prevent: false
      },
      mousemove: {
        prevent: false
      },
      mousedown: {
        prevent: false
      },
      mouseup: {
        prevent: false
      },
      touchstart: {
        prevent: false
      },
      touchend: {
        prevent: false
      },
      touchmove: {
        prevent: true
      }
    }

    for (const [event, prop] of Object.entries(events)) {
      window.addEventListener(event, e => {
        this.bus.$emit(event, e)
        const { prevent } = prop
        if (prevent) e.preventDefault()
      })
    }

    const { app } = this.$refs
    const appManager = new Hammer.Manager(app)
    const Swipe = new Hammer.Swipe()
    appManager.add(Swipe)

    appManager.on('swipe', e => {
      const { offsetDirection } = e
      if (offsetDirection === 2) this.pannelIndex += 1
      else if (offsetDirection === 4) this.pannelIndex -= 1

      if (offsetDirection === 8) this.console = true
      else if (offsetDirection === 16) this.console = false
      else this.console = false

      this.pannelIndex = this.clamp(
        this.pannelIndex,
        0,
        this.interfaceTemplate.pannels.length - 1
      )
    })

    // Initialize websocket connection
    if (window.WebSocket) {
      try {
        this.socket = new WebSocket('ws://192.168.1.104:1337')
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
      } catch (e) {
        alert('websocket')
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
  -webkit-tap-highlight-color:rgba(0,0,0,0)
html, body
  width: 100%
  height: 100%
  margin: 0
  overflow: hidden
  font-family: Helvetica, Arial
#app
  height: 100%
  background: rgb(230, 230, 230)
  &.console
    .console-pannel
      transform: translate(0, 0)
  .console-pannel
    top: 0
    left: 0
    position: fixed
    width: 100%
    height: 100vh
    z-index: 2
    background: #071733
    will-change: transform
    transform: translate(0, 100%)
    transition: transform 0.3s ease-in-out;
    padding: 22px 10px 10px 10px
    .text-container
      border-radius: 10px
      border: solid 1px white
      height: 100%
  .pannels
    height: 100%
    white-space: nowrap
    display: flex
    transition: transform 0.3s ease-in-out
    will-change: transform
    @for $i from 0 to 10
      &.pannel-#{$i}
        transform: translate(#{$i * -100%}, 0)
    .pannel
      padding: 22px 10px 10px 10px
      flex: 0 0 auto
      white-space: initial
      display: flex
      flex-flow: column
      width: 100%
      height: 100%
      // margin-right: 5px
      align-items: stretch;
      .pannel-label
        margin: 0
        padding: 5px
        text-align: center
      .row
        display: flex
        flex: 1 1 auto
        flex-flow: row
        align-items: stretch
        height: 25%
        .input-container
          height: auto
          flex: 1 1 auto
          display: flex
          flex-flow: column
          padding: 5px 5px 0 5px
          .label
            margin: 5px 0 0 0
            background: rgb(210, 210, 210)
            border-radius: 5px;
            text-align: center
</style>
