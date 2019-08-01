<template>
  <div>
    <el-button @click="handleAdd" type="default">添加课件</el-button>
    <Dialog title="添加课件" v-model="visible" @handleOk="handleOk">
      <section-line :labelWidth="50">
        <cos-upload acceptType="video/mp4" v-model="roomInfo.videoUrls" :fileMaxSize="20 * 1024 * 1024" :fileLimitNum="fileMaxNum">
          <span>mp4格式，小于20M</span>
        </cos-upload>
      </section-line>
    </Dialog>
  </div>
</template>

<script>
import SectionLine from '../../components/SectionLine';
import Dialog from '../../components/Dialog';
import CosUpload from '../../components/CosUpload';

export default {
  name: 'CosUploadDialog',
  data() {
    return {
      visible: false,
      fileMaxNum: 5,
      roomInfo: {
        videoUrls: {}
      }
    }
  },
  methods: {
    handleAdd() {
      this.visible = true;
    },
    handleOk() {
      console.log(this.roomInfo.videoUrls)
      this.visible = false;
    }
  },
  components: {
    Dialog,
    SectionLine,
    CosUpload
  }
}
</script>

<style scoped>

</style>
