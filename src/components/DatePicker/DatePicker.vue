<template>
  <div class="ocm-date-picker">
    <el-date-picker
      clearable
      :disabled="disabled"
      @change="change"
      v-model="startTime"
      type="datetime"
      :picker-options="pickerOptions"
      :format="format"
      :value-format="format"
      :placeholder="placeholder">
    </el-date-picker>
    <small v-if="tips" v-text="tips"></small>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'DatePicker',
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
    tips: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    limitCondition: {
      type: Number,
      default: Date.now()
    },
    placeholder: {
      type: String,
      default: '选择日期时间'
    }
  },
  data() {
    const t = this.limitCondition;
    let pickerOptions = {
      disabledDate(time) {
        return time.getTime() < t - 3600 * 1000 * 24;
      }
    };
    return {
      startTime: this.time,
      pickerOptions
    }
  },
  methods: {
    change(val) {
      const isPastTime = new Date(val).getTime() < this.limitCondition;
      if (isPastTime) {
        this.startTime = moment().format('YYYY-MM-DD HH:mm');
        val = moment().format('YYYY-MM-DD HH:mm');
      }
      this.$emit('change', val);
    }
  },
  watch: {
    time(t) {
      this.startTime = t;
    }
  }
}
</script>
