<template>
  <div class="page">
    <h2>{{caption[pageStatus]}}教室信息</h2>
    <Room ref="roomBox" labelWidth="90px" :creatorId="creatorId" :vendorId="vendorId" v-model="roomInfo" :pageStatus="pageStatus" :uploadAction="uploadAction">
      <template slot-scope="scope" v-if="pageStatus === 'edit'">
        <el-button type="primary" @click="updateClassroom(scope.data.submitForm)">更新</el-button>
      </template>
    </Room>
    <div class="pdbt100"></div>
  </div>
</template>

<script>
import moment from 'moment';
import service from '../../api';
// import SectionLine from '../../components/SectionLine';
import Room from '../../prefabs/Room'
import constant from '../../config/constant'

const { classroomManagementService } = service;

const defaultRoomInfo = {
  emailSuffix: constant.emailSuffix,
  roomName: '',
  teacherName: '',
  teacherId: '',
  lessonId: '',
  ocId: '',
  teacherEmail: '',
  staticDocs: [],
  dynamicDocs: [],
  defaultDocs: [],
  videoUrls: {},
  imgSrc: {},
  imgSrcPhone: {},
  scheduleDateTime: '',
  duration: 30,
  introduce: ''
};

export default {
  name: 'EditRoom',
  props: ['creatorId', 'vendorId'],
  data() {
    return {
      originalInfo: {},
      pageStatus: this.$route.query.pageStatus,
      roomInfo: Object.assign({}, defaultRoomInfo),
      uploadAction: classroomManagementService.uploadUrl,
      caption: {
        view: '查看',
        edit: '编辑'
      }
    };
  },
  created() {
    this.getRoomDetail();
  },
  methods: {
    getRoomDetail() {
      const roomId = this.$route.query.roomId;
      const params = { roomId };
      classroomManagementService.getRoomDetail(params).then(res => {
        console.log(res);
        const { code, data, msg } = res;
        if (code === 200) {
          this.roomInfo = this.formatData(data);
          this.originalInfo = Object.assign({}, this.roomInfo);
        } else {
          this.$message({
            type: 'warning',
            message: msg
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    formatData(data) {
      const defaultData = Object.assign({}, defaultRoomInfo);
      // staticDocs defaultDocs
      let { roomId, roomName, teacherName, duration, introduce, createDataTime, teacherId,
        productId,
        lineId,
        vendorId,
        creatorId,
        studentUrl,
        teacherUrl,
        roomStatus,
        inviteCode,
        ocId,
        lessonId, scheduleDateTime, teacherEmail, dynamicDocs, videoUrls, imgSrcPhone, imgSrc, staticDocsIns } = data;
      scheduleDateTime = moment(scheduleDateTime).format('YYYY-MM-DD HH:mm');
      videoUrls = (videoUrls && videoUrls.length) ? Object.fromEntries(videoUrls.map(url => {
        return [this.getName(url), {
          url: url,
          // resId: '100_bbdc2410219d47b442bab6935b93c1e4',
          loading: false,
          percent: 100
        }]
      })) : {};
      imgSrcPhone = imgSrcPhone ? Object.fromEntries([[this.getName(imgSrcPhone), {
        url: imgSrcPhone,
        loading: false,
        percent: 100
      }]]) : {};
      imgSrc = imgSrc ? Object.fromEntries([[this.getName(imgSrc), {
        url: imgSrc,
        loading: false,
        percent: 100
      }]]) : {};
      staticDocsIns = (staticDocsIns && staticDocsIns.length) ? staticDocsIns.map(item => {
        const { docName, docType, docId, docPreviewUrl, docSize } = item;
        item.name = docName;
        item.docPreviewUrl = docName;
        item.size = docSize;
        return item;
      }) : [];
      const responseData = {
        roomId,
        teacherId: teacherId || '',
        createDataTime,
        productId,
        lineId,
        vendorId,
        creatorId,
        studentUrl,
        inviteCode,
        teacherUrl,
        roomStatus,
        lessonId: lessonId === 0 ? '' : lessonId,
        roomName,
        ocId,
        teacherName,
        teacherEmail,
        staticDocs: staticDocsIns || [],
        dynamicDocs,
        videoUrls,
        imgSrc,
        imgSrcPhone,
        scheduleDateTime,
        duration,
        introduce
      };
      return Object.assign({}, defaultData, responseData);
    },
    getName(str) {
      const temp = str.match(/\/([^/]+)$/);
      return temp ? temp[1] : str;
    },
    updateClassroom(submitForm) {
      submitForm(() => {
        // const creatorId = this.creatorId;
        const vendorId = this.vendorId;
        let { lineId, productId, roomId, roomName, introduce, teacherName, teacherId, lessonId, teacherEmail, emailSuffix, scheduleDateTime, duration, imgSrcPhone, imgSrc, videoUrls, staticDocs, dynamicDocs } = this.roomInfo;
        scheduleDateTime = moment(scheduleDateTime).valueOf();
        imgSrc = Object.entries(imgSrc).map(([key, item]) => item.url)[0];
        imgSrcPhone = Object.entries(imgSrcPhone).map(([key, item]) => item.url)[0];
        videoUrls = Object.entries(videoUrls).map(([key, item]) => item.url);
        staticDocs = staticDocs.map(item => item.docId);
        // docId
        const params = {
          roomId,
          teacherId,
          roomName,
          scheduleDateTime,
          duration: duration || 30,
          lessonId: lessonId || 0,
          teacherName,
          teacherEmail,
          staticDocs,
          // dynamicDocs: [...dynamicDocs],
          videoUrls,
          imgSrcPhone,
          imgSrc,
          introduce,
          vendorId: vendorId,
          lineId,
          productId
          // creatorId: creatorId
        };
        const isPass = this.$refs['roomBox'].verify(params);
        console.log('params', isPass, params);
        isPass && classroomManagementService.updateRoom(params).then(res => {
          console.log(res);
          const { code, data, msg } = res;
          if (code === 200) {
            this.$message({
              type: 'success',
              message: '更新成功！'
            });
            this.$router.push({ path: '/roomList' });
          } else {
            this.$message({
              type: 'warning',
              message: msg
            })
          }
        }).catch(err => {
          console.log(err);
        });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {},
  computed: {
    isEqual() {
      const res = _.isEqual(this.roomInfo, this.originalInfo);
      this.$emit('infoChange', res);
      return res;
    }
  },
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

