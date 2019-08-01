<template>
  <div class="page">
    <h2>创建教室信息</h2>
    <Room ref="roomBox" :creatorId="creatorId" :vendorId="vendorId" v-model="roomInfo" pageStatus="create" :uploadAction="uploadAction">
      <template slot-scope="scope">
        <el-button type="primary" @click="createClassroom(scope.data.submitForm)">创建</el-button>
      </template>
    </Room>
    <!--<section-line>
      <el-button type="primary" @click="createClassroom">创建</el-button>
    </section-line>-->
    <div class="pdbt100"></div>
  </div>
</template>

<script>
import moment from 'moment';
// import SectionLine from '../../components/SectionLine';
import Room from '../../prefabs/Room';
import service from '../../api';
import constant from '../../config/constant';

const { classroomManagementService } = service;
export default {
  name: 'CreateRoom',
  props: ['creatorId', 'vendorId'],
  data() {
    return {
      roomInfo: {
        emailSuffix: constant.emailSuffix,
        roomName: '',
        teacherName: '',
        teacherEmail: '',
        teacherId: '',
        lessonId: '',
        staticDocs: [],
        dynamicDocs: [],
        defaultDocs: [],
        videoUrls: {},
        imgSrc: {},
        imgSrcPhone: {},
        scheduleDateTime: moment().format('YYYY-MM-DD HH:mm'),
        duration: 30,
        introduce: ''
      },
      creating: false,
      uploadAction: classroomManagementService.uploadUrl
    };
  },
  methods: {
    createClassroom(submitForm) {
      if (!this.creating) {
        this.creating = true;
        submitForm(() => {
          const creatorId = this.creatorId;
          const vendorId = this.vendorId;
          let { roomName, teacherName, teacherEmail, emailSuffix, staticDocs, introduce, scheduleDateTime, duration, imgSrcPhone, imgSrc, videoUrls, teacherId, lessonId, dynamicDocs } = this.roomInfo;
          scheduleDateTime = moment(scheduleDateTime).valueOf();
          imgSrc = Object.entries(imgSrc).map(([key, item]) => item.url)[0];
          imgSrcPhone = Object.entries(imgSrcPhone).map(([key, item]) => item.url)[0];
          videoUrls = Object.entries(videoUrls).map(([key, item]) => item.url);
          staticDocs = staticDocs.map(item => item.docId);
          const nowTime = Date.now();
          if (scheduleDateTime < nowTime) {
            scheduleDateTime = nowTime;
          }
          const params = {
            teacherId,
            lessonId: lessonId || 0,
            roomName,
            scheduleDateTime,
            duration: duration || 30,
            teacherName,
            teacherEmail,
            staticDocs,
            // dynamicDocs: [...dynamicDocs],
            videoUrls,
            imgSrcPhone,
            imgSrc,
            introduce,
            vendorId: vendorId,
            lineId: 3,
            productId: 1,
            creatorId: creatorId + ''
          };
          const isPass = this.$refs['roomBox'].verify(params);
          isPass && classroomManagementService.createRoom(params).then(res => {
            if (res.code === 200) {
              this.creating = false;
              this.$alert('教室创建成功！', {
                confirmButtonText: '确定',
                center: true,
                callback: action => {
                  this.$router.push({ path: '/roomList' });
                }
              });
            } else {
              this.$message({
                type: 'warning',
                message: res.msg,
                onClose: () => {
                  this.creating = false;
                }
              });
            }
          }).catch(err => {
            setTimeout(() => {
              this.creating = false;
            }, 300);
            console.log(err);
          });
        });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {},
  computed: {},
  watch: {},
  components: {
    Room
    // SectionLine
  }
};
</script>

<style lang="scss" scoped>
  .page {
    position: relative;
    .test-box {
      position: absolute;
      top: 100px;
      right: 50px;
      width: 300px;
      background: #f6f2ee;
      line-height: 32px;
      padding: 10px;
      border: 1px solid #e6e6e6;
    }
    .pdbt100 {
      padding-bottom: 100px;
    }
  }
</style>
