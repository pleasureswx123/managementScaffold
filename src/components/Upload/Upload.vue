<template>
  <el-upload
    :on-preview="handlePreview"
    :before-remove="beforeRemove"
    class="ocm-upload upload-demo"
    ref="upload"
    :disabled="disabled"
    :accept="acceptType"
    :action='url'
    :on-change="handleChange"
    :before-upload="beforeUpload"
    :on-remove="handleRemove"
    :file-list="currentFileList"
    :auto-upload='false'
    :limit="fileMaxNum"
    :with-credentials="true"
    :on-exceed="handleExceed"
    multiple
    :on-success='handleSuccess'
    :name="paramsName">
    <el-button v-if="!isUpperLimit" :disabled="disabled" class="mgrt10" slot="trigger" size="small" type="default">选取文件</el-button>
    <el-button v-if="uploadToButtonVisib" :disabled="disabled || !uploadStatus" style="margin-left: 10px;" size="small" type="primary" @click="submitUpload">上传到服务器</el-button>
    <div slot="tip" class="el-upload__tip">
      <p>1、课件支持{{fileFormat}}格式。课中不支持上传课件</p>
      <p>2、最多支持20M的文件</p>
      <p>3、上传的{{fileFormat}}中的图片比例为4:3</p>
      <p v-if="showAdd">4、也可以通过已有列表<slot :show="false"></slot></p>
    </div>
  </el-upload>
</template>

<script>

export default {
  name: 'Upload',
  model: {
    prop: 'fileList',
    event: 'change'
  },
  props: {
    creatorId: {
      type: Number
    },
    vendorId: {
      type: Number
    },
    url: {
      type: String,
      required: true
    },
    fileList: {
      type: Array,
      default: () => []
    },
    fileMaxNum: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    uploadToButtonVisib: {
      type: Boolean,
      default: true
    },
    showAdd: {
      type: Boolean,
      default: false
    },
    validateAttr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      paramsName: 'uploadFile',
      fileLimitNum: this.fileMaxNum,
      currentFileList: this.fileList,
      fileFormat: 'pdf',
      fileMaxSize: 20 * 1024,
      acceptType: 'application/pdf'
    };
  },
  watch: {
    fileList(list) {
      this.currentFileList = [...list];
    }
  },
  computed: {
    uploadStatus() {
      return this.currentFileList.length > 0;
    },
    isUpperLimit() {
      return this.currentFileList.length >= this.fileLimitNum;
    }
  },
  methods: {
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.fileLimitNum} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleRemove(file, fileList = []) {
      this.currentFileList = [...fileList];
      if (file.docId) {
        this.$emit('change', [...this.currentFileList]);
      }
      return file;
    },
    handleChange(file, fileList = []) {
      if (file.status === 'success') {
        return false;
      }
      if (file.status === 'fail') {
        return this.$message.warning(`当前文件上传失败!`);
      }
      const isExist = this.currentFileList.some(item => item.name === file.name);
      if (isExist) {
        this.$message.warning(`当前上传的文件已经存在!`);
        this.currentFileList = fileList.slice(-1);
        return false;
      }
      const type = file.raw.type;
      const fileMaxSize = this.fileMaxSize;
      const isFormatCorrect = type === this.acceptType;
      if (!isFormatCorrect) {
        this.$message.warning(`请上传${this.fileFormat}格式的文件`);
      }
      const isBeyondUpperLimit = file.size / 1024 < fileMaxSize;
      if (!isBeyondUpperLimit) {
        this.$message.warning(`最大可上传${fileMaxSize / 1024}M文件，请重新上传!`);
      }
      if (isFormatCorrect && isBeyondUpperLimit) {
        this.currentFileList = [...fileList];
        return file;
      } else {
        this.currentFileList = fileList.slice(-1);
        return false;
      }
    },
    submitUpload() {
      return this.$refs.upload.submit();
    },
    beforeUpload(file) {
      const type = file.type;
      const isFormatCorrect = type === this.acceptType;
      if (isFormatCorrect) {
        return file;
      } else {
        this.$message.warning(`请上传${this.fileFormat}格式的文件`);
        return false;
      }
    },
    handleSuccess(res, file, fileList) {
      if (res.code === 200) {
        const status = fileList.every(item => item.status === 'success');
        if (status) {
          const list = [];
          fileList.forEach(item => {
            if (item.docId) {
              const { docName, docId, docPreviewUrl, name, url, size, docSize } = item;
              if (!name) {
                item.name = docName;
              }
              if (!url) {
                item.url = docPreviewUrl;
              }
              if (!size) {
                item.size = docSize;
              }
              list.push(item);
            } else {
              const { name, size, uid, response: { data: staticDocId } } = item;
              list.push({
                name,
                url: '',
                docId: staticDocId,
                docName: name,
                docPreviewUrl: '',
                size,
                docSize: size
              });
            }
          });
          if (list.length === fileList.length) {
            this.$emit('change', list);
            this.$emit('validateField', this.validateAttr);
            this.$message.success('上传成功！');
            this.$emit('successUpload');
          }
        }
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        });
        this.currentFileList = [];
        return false;
      }
    },
    handleError(error = {}) {
      this.$message.error(error.message || '文件上传失败，请重新上传!');
    },
    handlePreview(file) {}
  }
}
</script>
