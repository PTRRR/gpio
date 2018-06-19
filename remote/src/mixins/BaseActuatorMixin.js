import BaseMixin from './BaseMixin'
import MathMixin from './MathMixin'

export default {
  mixins: [BaseMixin, MathMixin],
  props: {
    pin: {
      type: Number,
      default: null
    }
  },
  mounted () {
    if (this.pin === null) {
      console.error('You have to define a pin!')
    }
  },
  methods: {
    emit (value) {
      this.$emit('input', {
        type: this.type,
        message: {
          pin: this.pin,
          value
        }
      })
    }
  }
}
