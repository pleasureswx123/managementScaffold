<template>
  <el-date-picker
    clearable
    v-model="value"
    :disabled="disabled"
    type="datetimerange"
    @change="change"
    :format="format"
    :value-format="format"
    :default-time="['00:00:00', '23:59:00']"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期">
  </el-date-picker>
</template>

<script>
export default {
  name: 'DateTimeRange',
  model: {
    prop: 'time',
    event: 'change'
  },
  props: {
    time: {
      required: true
    },
    format: {
      default: 'yyyy-MM-dd HH:mm:ss'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: this.time
    };
  },
  methods: {
    change(val) {
      this.$emit('change', [...val || []]);
    }
  },
  watch: {
    time(t) {
      this.value = t;
    }
  }
}
</script>
