<template>
  <div class="ocm-cascader">
    <el-cascader
      :disabled="disabled"
      :options="currentOptions"
      v-model="currentSelectedOptions"
      @change="handleChange">
    </el-cascader>
    <small v-if="tips" v-text="tips"></small>
  </div>
</template>

<script>
export default {
  name: 'Cascader',
  model: {
    prop: 'defaultDocs',
    event: 'change'
  },
  props: {
    defaultDocs: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
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
    return {
      currentOptions: [...this.options],
      currentSelectedOptions: [...this.defaultDocs]
    };
  },
  methods: {
    handleChange(value) {
      this.$emit('change', [...value]);
    }
  },
  watch: {
    options(list) {
      this.currentOptions = [...list];
    },
    defaultDocs(val) {
      this.currentSelectedOptions = [...val];
    }
  }
}
</script>
