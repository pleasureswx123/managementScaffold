<template>
  <div class="ocm-add-doc">
    <el-button @click="handleAdd" :disabled="disabled || isMaxNum">添加课件</el-button>
    <template v-if="show">
      <ul class="docs-box" :class="{disabled}" v-if="currentStaticDocs.length">
        <li v-for="(doc, index) in currentStaticDocs" :key="doc.docId">
          <i class="left-slide el-icon-document"></i>
          <span class="name">{{doc.docName}}</span>
          <span class="right-slide el-icon el-icon-close" @click="handleDel(index)"></span>
        </li>
      </ul>
    </template>
    <el-dialog
      title="请选择课件"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <pdf-list ref="pdfListContent" :creatorId="creatorId" :vendorId="vendorId" :hiddenUploadStatus="true"></pdf-list>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import PdfList from '../PdfList';

export default {
  name: 'AddDoc',
  model: {
    prop: 'staticDocs',
    event: 'change'
  },
  props: {
    fileMaxNum: {
      type: Number
    },
    creatorId: {
      type: Number
    },
    vendorId: {
      type: Number
    },
    staticDocs: {
      type: Array,
      default: () => []
    },
    pageStatus: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: true
    },
    validateAttr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentStaticDocs: this.staticDocs,
      dialogVisible: false
    };
  },
  computed: {
    isMaxNum() {
      return this.currentStaticDocs.length >= this.fileMaxNum;
    }
  },
  methods: {
    handleAdd() {
      this.dialogVisible = true;
    },
    handleDel(index) {
      this.$confirm(`此操作将删除该文件, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.currentStaticDocs.splice(index, 1);
        this.$emit('change', [...this.currentStaticDocs]);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消！`
        });
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleSubmit() {
      const selectionList = this.$refs['pdfListContent'].selectionList;
      selectionList.forEach(doc => {
        const hasDoc = this.currentStaticDocs.some(item => item.docId === doc.docId);
        if (!hasDoc && !this.isMaxNum) {
          const { name, url, size, docName, docPreviewUrl, docSize } = doc;
          if (!name) {
            doc.name = docName;
          }
          if (!url) {
            doc.url = docPreviewUrl;
          }
          if (!size) {
            doc.size = docSize;
          }
          this.currentStaticDocs.push(doc);
        }
      });
      this.$emit('change', [...this.currentStaticDocs]);
      this.$emit('validateField', this.validateAttr);
      this.dialogVisible = false;
    }
  },
  watch: {
    staticDocs(docs) {
      this.currentStaticDocs = docs;
    }
  },
  components: {
    PdfList
  }
}
</script>
