<template>
  <el-pagination
    class="ocm-page"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="params.currentPage"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="params.pageSize"
    layout="prev, pager, next, jumper"
    :total="params.total">
  </el-pagination>
</template>

<script>
export default {
  name: 'Pagination',
  model: {
    prop: 'paginationParams',
    event: 'change'
  },
  props: {
    paginationParams: {
      type: Object,
      default: () => ({
        currentPage: 1,
        pageSize: 10,
        total: 1
      })
    }
  },
  data() {
    return {
      params: this.paginationParams
    };
  },
  methods: {
    handleSizeChange(pageSize) {
      // this.$emit('change', Object.assign({}, this.paginationParams, { pageSize, currentPage: 1 }));
      alert('pageSize')
      // this.$emit('getData')
    },
    handleCurrentChange(currentPage) {
      this.$emit('change', Object.assign(this.paginationParams, { currentPage }));
      this.$emit('getCurrentPageData', { currentPage });
    }
  },
  watch: {
    paginationParams(params) {
      this.params = params;
    }
  }
}
</script>
