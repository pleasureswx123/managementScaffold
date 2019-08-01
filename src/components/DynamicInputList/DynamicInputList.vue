<template>
  <div class="ocm-dynamic-input-list">
    <el-input
      :disabled="disabled"
      v-for="(item, index) in urlList"
      :key="index"
      :value="item"
      @input.native="(event) => {change(event, index)}"
      placeholder="请输入url内容">
      <template slot="prepend">url-{{index}}</template>
      <el-button v-if="index === 0" slot="append" :disabled="disabledStatus" @click="handleAdd">+</el-button>
      <el-button v-else slot="append" :disabled="disabled" @click="handleDel(index)">-</el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'DynamicInputList',
  model: {
    prop: 'list',
    event: 'change'
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    maxNum: {
      type: Number,
      default: 5
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      urlList: this.list.length > 0 ? this.list : ['']
    }
  },
  computed: {
    disabledStatus() {
      return this.urlList.length === this.maxNum || this.disabled;
    }
  },
  methods: {
    change(event, index) {
      this.$set(this.urlList, index, event.target.value);
    },
    handleAdd() {
      this.$set(this.urlList, this.urlList.length, '');
    },
    handleDel(index) {
      this.urlList.splice(index, 1);
    }
  },
  watch: {
    urlList(list) {
      this.$emit('change', list);
    }
  }
}
</script>
