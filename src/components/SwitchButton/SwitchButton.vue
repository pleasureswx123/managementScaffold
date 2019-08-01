<template>
  <el-switch
    :disabled="disabled"
    class="ocm-switch-button"
    @change="change"
    v-model="status"
    active-color="#f3794b"
    inactive-color="#eaecf0">
  </el-switch>
</template>

<script>
export default {
  name: 'SwitchButton',
  model: {
    prop: 'batchStatus',
    event: 'change'
  },
  props: {
    batchStatus: {
      default: false,
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      status: this.batchStatus
    }
  },
  methods: {
    change(status) {
      this.$emit('change', status);
    }
  }
}
</script>
