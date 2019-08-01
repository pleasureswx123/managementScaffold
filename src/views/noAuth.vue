<template>
  <div class="noAuth">没有权限或请求地址错误</div>
</template>

<script>
export default {
  name: 'noAuth',
  data() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
  .noAuth {
    line-height: 300px;
    text-align: center;
    border: 1px solid #e2e2e2;
    background: #fbe6de;
    color: #5f5f5f;
    min-height: 100%;
    font-size: 20px;
  }
</style>
