<template>
  <div class="ocm-input-number">
    <el-input-number
      :controls="controls"
      @change="change"
      :disabled="disabled"
      v-model="number"
      :placeholder="placeholder"
      controls-position="right"
      :step="step"
      :min="min"
      :max="max"
      :precision="0"
      step-strictly></el-input-number>
    <small v-if="tips" v-text="tips"></small>
  </div>
</template>

<script>
export default {
  name: 'InputNumber',
  model: {
    prop: 'num',
    event: 'change'
  },
  props: {
    controls: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    num: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 10
    },
    step: {
      type: Number,
      default: 1
    },
    tips: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      number: this.num
    }
  },
  methods: {
    change(num) {
      this.$emit('change', num);
    }
  },
  watch: {
    num(val) {
      if (this.number !== val) {
        this.number = val;
      }
    },
    disabled(status) {
      if (status) {
        this.number = 1;
        this.change(this.number);
      }
    }
  }
}
</script>
