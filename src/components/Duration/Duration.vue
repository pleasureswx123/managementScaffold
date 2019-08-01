<template>
  <div class="ocm-duration">
    <input-number :disabled="disabled" v-model="hours" :min="0" :max="5" placeholder="时" tips="时"></input-number>
    <input-number :disabled="disabled" v-model="minutes" :min="minutesMin" :max="59" :step="1" placeholder="分" tips="分" step-strictly></input-number>
    <small v-if="tips" v-text="tips"></small>
  </div>
</template>

<script>
import InputNumber from '../InputNumber';

export default {
  name: 'Duration',
  model: {
    prop: 'duration',
    event: 'change'
  },
  props: {
    duration: {
      type: Number,
      default: 0
    },
    tips: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const { hours, minutes } = this.getHM(this.duration);
    return {
      hours,
      minutes
    };
  },
  methods: {
    getHM(duration) {
      duration = +duration;
      let hours = 0;
      let minutes = 0;
      if (duration < 60) {
        hours = 0;
      } else if (duration < 120) {
        hours = 1;
      } else if (duration < 180) {
        hours = 2;
      } else if (duration < 240) {
        hours = 3;
      } else if (duration < 300) {
        hours = 4;
      } else if (duration < 360) {
        hours = 5;
      }
      minutes = duration - hours * 60;
      return { hours, minutes }
    }
  },
  computed: {
    durationVal() {
      return this.hours * 60 + this.minutes;
    },
    minutesMin() {
      if (this.durationVal <= 30) {
        return 30
      } else {
        return 0
      }
    }
  },
  components: {
    InputNumber
  },
  watch: {
    durationVal(val) {
      if (val < 30) {
        this.minutes = 30;
      }
      if (val >= 300) {
        this.minutes = 0;
      }
      this.$emit('change', val);
    },
    duration(val) {
      console.log(2);
      const { hours, minutes } = this.getHM(val);
      this.hours = hours;
      this.minutes = minutes;
    }
  }
}
</script>
