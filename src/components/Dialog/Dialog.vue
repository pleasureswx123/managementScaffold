<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
    <div>
      <slot v-if="$slots.default"></slot>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    title: {
      type: String,
      default: '提示'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.visible
    };
  },
  methods: {
    close() {
      this.dialogVisible = false;
      this.$emit('change', false);
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          this.$emit('change', false);
        })
        .catch(_ => {});
    },
    handleOk() {
      this.$emit('handleOk');
    }
  },
  watch: {
    visible(visible) {
      this.dialogVisible = visible;
    }
  }
}
</script>
