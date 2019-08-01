<template>
  <div>
    <el-button @click="handleAdd" type="default">上传课件</el-button>
    <el-button @click="handleDelDoc" type="default" :disabled="!selectionList.length">删除课件</el-button>
    <template v-if="visible">
      <Dialog title="上传课件" v-model="visible" @handleOk="handleOk">
        <section-line :labelWidth="50">
          <upload
            ref="upload"
            v-model="roomInfo.staticDocs"
            :creatorId="creatorId"
            :vendorId="vendorId"
            :uploadToButtonVisib="false"
            :url="uploadAction"
            :fileMaxNum="fileMaxNum"
            @successUpload="successUpload"
            @addStaticdoc="handleAddStaticdoc"></upload>
        </section-line>
      </Dialog>
    </template>
  </div>
</template>

<script>
import service from '../../api';
import SectionLine from '../../components/SectionLine';
import Dialog from '../../components/Dialog';
import Upload from '../../components/Upload';

const { classroomManagementService } = service;

export default {
  name: 'PdfUploadDialog',
  props: ['creatorId', 'vendorId', 'selectionList'],
  data() {
    return {
      visible: false,
      fileMaxNum: Infinity,
      uploadAction: classroomManagementService.uploadUrl,
      roomInfo: {
        staticDocs: []
      }
    }
  },
  methods: {
    handleAddStaticdoc(params) {
      classroomManagementService.addStaticdoc(params).then(res => {
        this.visible = false;
      }).catch(err => {
        console.log(err);
      });
    },
    handleAdd() {
      this.visible = true;
    },
    handleDelDoc() {
      this.$emit('handleDelDoc')
    },
    successUpload() {
      setTimeout(() => {
        this.visible = false;
        this.roomInfo = {
          staticDocs: []
        };
        this.$emit('successUploadGetData')
      }, 1000);
    },
    handleOk() {
      this.$refs.upload.submitUpload();
    }
  },
  components: {
    Dialog,
    SectionLine,
    Upload
  }
}
</script>

<style scoped>

</style>
