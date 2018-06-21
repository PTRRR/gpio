export default {
  created () {
    const _log = console.log
    console.log = function (logMessage) {
      alert(logMessage)
      _log.apply(console, arguments)
    }
  }
}
