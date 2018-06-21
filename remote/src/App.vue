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
      .text-container(
        v-if='console'
        ref='textContainer'
      )
        template(v-for='(log, index) in logs')
          p(v-if='index === 0') Last Log ---------
          p(
            :class='log.type'
            v-html='log.message'
            v-if='index < 30'
          )
          p(v-if='index === 0') ------------------
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
      isInput: false,
      socket: null,
      connected: false,
      interfaceTemplate,
      pannelIndex: 0,
      console: false,
      logs: []
    }
  },
  watch: {
    isInput () {
      if (this.isInput) {
        setTimeout(() => {
          this.isInput = false
        }, 100)
      }
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
  created () {
    // Override console methods
    const self = this
    const log = console.log
    const warn = console.warn
    const error = console.error
    console.log = function (logMessage) {
      self.consoleLog(logMessage)
      log.apply(console, arguments)
    }

    console.warn = function (warnMessage) {
      self.consoleWarn(warnMessage)
      warn.apply(console, arguments)
    }

    console.error = function (errorMessage) {
      self.consoleError(errorMessage)
      error.apply(console, arguments)
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
        prevent: false
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
      if (offsetDirection === 2 && !this.isInput) this.pannelIndex += 1
      else if (offsetDirection === 4 && !this.isInput) this.pannelIndex -= 1

      if (offsetDirection === 8 && !this.isInput) this.console = true
      else if (offsetDirection === 16 && !this.isInput) this.console = false
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
        this.socket = new WebSocket('ws://10.192.233.251:1337')
        this.socket.onmessage = ({ data }) => {
          const msg = JSON.parse(data)
          const { type, message } = msg
          switch (type) {
            case 'connected':
              console.log('WEBSOCKET CONNECTION -> OK')
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
      console.error('This browser doesn\'t support websocket')
    }
  },
  methods: {
    sendMessage (type, message) {
      if (this.socket && this.connected) {
        this.socket.send(JSON.stringify({type, message}))
        this.consoleLog(message)
      }
    },
    onInput ({ type, message }) {
      this.isInput = true
      this.sendMessage(type, message)
    },
    consoleLog (msg) {
      this.logs.unshift({
        type: 'log',
        message: this.consoleWrite(msg)
      })
    },
    consoleWarn (msg) {
      this.logs.unshift({
        type: 'warn',
        message: this.consoleWrite(msg)
      })
    },
    consoleError (msg) {
      this.console = true
      this.logs.unshift({
        type: 'error',
        message: this.consoleWrite(msg)
      })
    },
    consoleWrite (msg) {
      const date = new Date()
      return `> ${JSON.stringify(msg)}`
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
  background: #E8ECED
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
    padding: 22px 7px 7px 7px
    .text-container
      border-radius: 10px
      // border: solid 1px white
      background: rgba(0, 0, 0, 0.2)
      height: 100%
      font-size: 11px
      padding: 5px
      font-family: Courier
      overflow: scroll
      p
        margin: 2px
        display: inline-block
        width: 100%
        color: white
      .log
        color: white
      .warn
        color: orange
      .error
        color: red
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
      padding: 22px 2px 7px 2px
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
