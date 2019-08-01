<template>
  <div class="ocm-room">
    <el-form :model="roomInfo" :rules="rules" ref="ruleForm" :label-width="labelWidth" class="demo-ruleForm">
      <el-form-item v-if="roomInfo.roomId" label="教室ID" prop="roomId">
        <el-input v-model.trim="roomInfo.roomId" :disabled="true" class="width400" type="input"></el-input>
      </el-form-item>
      <el-form-item label="教室名称" prop="roomName">
        <el-input v-model.trim="roomInfo.roomName" :disabled="disabled" class="width400" type="textarea" placeholder="请输入教室名称" :autosize="{ minRows: 1, maxRows: 5}" minlength="1" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <!--<el-form-item label="老师名称" prop="teacherName">
        <el-input v-model.trim="roomInfo.teacherName" :disabled="disabled" class="width400" placeholder="请输入老师名称"></el-input>
      </el-form-item>
      <el-form-item label="老师邮箱" prop="teacherEmail">
        <el-input
          v-model.trim="roomInfo.teacherEmail"
          :disabled="disabled"
          class="width400 input-with-select-box"
          placeholder="请输入老师邮箱前缀">
          <el-select :disabled="disabled" v-model="roomInfo.emailSuffix" slot="append" placeholder="请选择">
            <el-option v-for="suffix in emailSuffixGroup" :key="suffix" :label="suffix" :value="suffix"></el-option>
          </el-select>
        </el-input>
      </el-form-item>-->
      <el-form-item label="老师ID" prop="teacherId">
        <el-input type="number" @blur="handleBlur" v-model.number="roomInfo.teacherId" :disabled="disabled" class="width200" placeholder="请输入老师ID"></el-input>
        <span class="tipsTeacherId" v-if="tipsInvalidTeacherId">请输入有效的老师ID</span>
      </el-form-item>
      <el-form-item label="lessonID" prop="lessonId">
        <el-input type="number" v-model.number="roomInfo.lessonId" :disabled="disabled" class="width200" placeholder="请输入lessonID"></el-input>
      </el-form-item>
      <el-form-item label="添加主课件" prop="staticDocs">
        <upload @validateField="validateField" validateAttr="staticDocs" v-model="roomInfo.staticDocs" :showAdd="true" :disabled="disabled" :url="uploadAction" :fileMaxNum="Infinity">
          <template slot-scope="scope">
            <AddDoc :show="scope.show" @validateField="validateField" validateAttr="staticDocs" :creatorId="creatorId" :vendorId="vendorId" v-model="roomInfo.staticDocs" :disabled="disabled" :pageStatus="pageStatus" :fileMaxNum="Infinity"></AddDoc>
          </template>
        </upload>
      </el-form-item>
      <el-form-item label="添加辅课件" prop="videoUrls">
        <cos-upload @validateField="validateField" validateAttr="videoUrls" acceptType="video/mp4" v-model="roomInfo.videoUrls" :disabled="disabled" :fileMaxSize="20 * 1024 * 1024" :fileLimitNum="10">
          <span>mp4格式，小于20M</span>
        </cos-upload>
      </el-form-item>
      <el-form-item label="PC封面" prop="imgSrc">
        <cos-upload v-model="roomInfo.imgSrc" :disabled="disabled"></cos-upload>
      </el-form-item>
      <el-form-item label="手机封面" prop="imgSrcPhone">
        <cos-upload pixel="740*422" v-model="roomInfo.imgSrcPhone" :disabled="disabled"></cos-upload>
      </el-form-item>
      <el-form-item label="开始时间" prop="scheduleDateTime">
        <date-picker v-model="roomInfo.scheduleDateTime" :disabled="disabled" tips="(大于当前时间点)" format="yyyy-MM-dd HH:mm"></date-picker>
      </el-form-item>
      <el-form-item label="使用时长" prop="duration">
        <duration v-model="roomInfo.duration" :disabled="disabled" tips="(最小使用时长30min，最大使用时长5h)"></duration>
      </el-form-item>
      <el-form-item label="教室简介" prop="introduce">
        <el-input
          v-model.trim="roomInfo.introduce"
          :disabled="disabled"
          class="width400"
          type="textarea"
          placeholder="请输入教室简介"
          :autosize="{ minRows: 3, maxRows: 5}"
          minlength="1" maxlength="500" show-word-limit></el-input>
      </el-form-item>
      <template v-if="pageStatus === 'view'">
        <el-form-item class="otherInfoItem" v-if="roomInfo.inviteCode" label="邀请码">
          <div>
            <span class="inviteCode">{{roomInfo.inviteCode}}</span> <span class="vkdiconfont vkdicon-fuzhi" @click="copyLink('inviteCode')"></span>
          </div>
        </el-form-item>
        <el-form-item class="otherInfoItem" label="其他信息">
          <div>
            <span>培训：</span>
          </div>
          <div>
            <span>老师登录链接：</span> <span class="teacherLink1">{{ocUrl}}?role=1&locale=zh-CN&roomId={{roomInfo.roomId}}</span> <span class="vkdiconfont vkdicon-fuzhi" @click="copyLink('teacherLink1')"></span>
          </div>
          <div>
            <span>学生登录链接：</span> <span class="studentLink1">{{ocUrl}}?role=2&locale=zh-CN&roomId={{roomInfo.roomId}}</span> <span class="vkdiconfont vkdicon-fuzhi" @click="copyLink('studentLink1')"></span>
          </div>
          <div>
            <span>教学：</span>
          </div>
          <div>
            <span>老师登录链接：</span> <span class="teacherLink2">{{oc2Url}}/teacher/pc/index.html?onlineClassId={{roomInfo.ocId}}&bizType=1</span> <span class="vkdiconfont vkdicon-fuzhi" @click="copyLink('teacherLink2')"></span>
          </div>
          <div>
            <span>学生登录链接：</span> <span class="studentLink2">{{oc2Url}}/student/pc/index.html?onlineClassId={{roomInfo.ocId}}&bizType=1</span> <span class="vkdiconfont vkdicon-fuzhi" @click="copyLink('studentLink2')"></span>
          </div>
        </el-form-item>
      </template>
      <el-form-item>
        <slot :data="{submitForm}"></slot>
        <!--<el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>-->
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
// import SectionLine from '../../components/SectionLine';
import Duration from '../../components/Duration';
import AddDoc from '../../components/AddDoc';
import Upload from '../../components/Upload';
import DatePicker from '../../components/DatePicker';
import CosUpload from '../../components/CosUpload';
// import DynamicInputList from '../../components/DynamicInputList';
// import Cascader from '../../components/Cascader';
// import SwitchButton from '../../components/SwitchButton';
// import InputNumber from '../../components/InputNumber';
import hostsUrl from '../../config/hots';
import constant from '../../config/constant';

import service from '../../api';

const { classroomManagementService } = service;
const ocUrl = hostsUrl.ocUrl;
const oc2Url = hostsUrl.oc2Url;

export default {
  name: 'Room',
  model: {
    prop: 'roomInfo',
    event: 'change'
  },
  props: {
    creatorId: {
      type: Number
    },
    vendorId: {
      type: Number
    },
    roomInfo: {
      type: Object,
      required: true,
      default: () => ({
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
      })
    },
    uploadAction: {
      type: String,
      required: true
    },
    pageStatus: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: '150px'
    }
  },
  data() {
    const validateVideoUrls = (rule, value, callback) => {
      const k = Object.keys(value);
      if (k.length) {
        callback();
      } else {
        callback(new Error('请至少选择一个辅课件'));
      }
    };
    // const validateImgSrc = (rule, value, callback) => {
    //   const k = Object.keys(value);
    //   if (k.length) {
    //     callback();
    //   } else {
    //     callback(new Error('请选择PC端封面图'));
    //   }
    // };
    // const validateImgSrcPhone = (rule, value, callback) => {
    //   const k = Object.keys(value);
    //   if (k.length) {
    //     callback();
    //   } else {
    //     callback(new Error('请选择手机端封面图'));
    //   }
    // };
    return {
      tipsInvalidTeacherId: false,
      ocUrl,
      oc2Url,
      emailSuffixGroup: [constant.emailSuffix],
      batchStatus: false,
      classroomNum: 1,
      disabled: this.pageStatus === 'view',
      rules: {
        roomName: [
          { required: true, message: '请输入教室名称', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ],
        // teacherName: [
        //   { required: true, message: '请输入老师名称', trigger: 'blur' },
        //   { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        // ],
        // teacherEmail: [
        //   { required: true, message: '请输入老师邮箱前缀', trigger: 'blur' }
        // ],
        teacherId: [
          { required: true, message: '请输入老师ID', trigger: 'blur' }
        ]
        // staticDocs: [
        //   { type: 'array', required: true, message: '请至少选择一个主课件', trigger: 'change' }
        // ],
        // videoUrls: [
        //   { required: true, validator: validateVideoUrls, trigger: 'change' }
        // ]
        // imgSrc: [
        //   { required: true, validator: validateImgSrc, trigger: 'change' }
        // ],
        // imgSrcPhone: [
        //   { validator: validateImgSrcPhone, trigger: 'change' }
        // ],
        // scheduleDateTime: [
        //   { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
        // ],
        // introduce: [
        //   { required: true, message: '请输入教室简介', trigger: 'blur' }
        // ]
      }
    };
  },
  methods: {
    handleBlur(evt) {
      classroomManagementService.getTearchinfo({ id: evt.target.value || 0 }).then(res => {
        const { code, data, msg} = res;
        if (code === 200) {
          this.tipsInvalidTeacherId = false;
          const {email, id, name} = data;
          this.roomInfo.teacherName = name;
          this.roomInfo.teacherEmail = email;
        } else {
          this.tipsInvalidTeacherId = true;
          this.roomInfo.teacherName = '';
          this.roomInfo.teacherEmail = '';
        }
      }).catch(err => {
        console.log(err);
      });
    },
    copyLink(className) {
      const el = document.getElementsByClassName(className)[0];
      window.getSelection().selectAllChildren(el);
      document.execCommand('Copy');
      this.$message({
        duration: 1000,
        type: 'success',
        message: '已复制!'
      });
    },
    validateField(field) {
      this.$refs['ruleForm'].validateField(field);
    },
    submitForm(fun) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          fun();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    verify(params) {
      const pattern = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
      const {
        roomName,
        scheduleDateTime,
        teacherName,
        teacherEmail,
        // staticDocs,
        // dynamicDocs,
        videoUrls,
        imgSrcPhone,
        imgSrc,
        introduce
      } = params;

      let errorTips = '';
      if (!roomName && !errorTips) {
        errorTips = '【教室名称】不能为空';
      }
      if (!teacherName && !errorTips) {
        errorTips = '请输入有效的老师ID';
      }
      if (!pattern.test(teacherEmail) && !errorTips) {
        errorTips = '请输入有效的老师ID';
      }
      // if (!defaultDocs.length && !errorTips) {
      //   errorTips = '静态或动态课件最少必须有一项！';
      // }

      // if (!staticDocs.length && !errorTips) { 静态课件可以为空
      //   errorTips = '主课件不能为空';
      // }

      // if (!dynamicDocs.length && !errorTips) {
      //   errorTips = '动态课件不能为空';
      // }
      // if (!videoUrls.length && !errorTips) {
      //   errorTips = '辅课件不能为空';
      // }
      // if (!imgSrc && !errorTips) {
      //   errorTips = 'PC端封面图不能为空';
      // }
      // if (!imgSrcPhone && !errorTips) {
      //   errorTips = '移动端封面图不能为空';
      // }
      // if (!scheduleDateTime && !errorTips) {
      //   errorTips = '开课时间不能为空';
      // }
      // if (!introduce && !errorTips) {
      //   errorTips = '教室简介不能为空';
      // }

      if (errorTips) {
        this.$message({
          type: 'warning',
          message: errorTips
        });
        return false;
      }
      return true;
    },
    getDefaultDocs() {
      const temp = [];
      this.coursewareList.forEach((item, index) => {
        temp[index] = [item.value];
        item.children.forEach(list => {
          if (temp[index].length === 1 && list.value) {
            temp[index].push(list.value);
          }
        })
      });
      let result = [];
      temp.forEach(item => {
        if (!result.length && item.length === 2) {
          result = item;
        }
      });
      this.$emit('change', Object.assign({}, this.roomInfo, { defaultDocs: result }));
    }
  },
  mounted() {
  },
  computed: {
    dynamicList() {
      const docs = _.get(this.roomInfo, 'dynamicDocs') || [];
      return docs.map(url => ({
        value: url,
        label: url
      }))
    },
    coursewareList() {
      return [{
        value: 'dynamic',
        label: '动态课件',
        children: [...this.dynamicList]
      }, {
        value: 'static',
        label: '静态课件',
        children: []
      }]
    }
  },
  watch: {},
  components: {
    // SectionLine,
    Duration,
    AddDoc,
    Upload,
    DatePicker,
    CosUpload
    // SwitchButton,
    // InputNumber,
    // DynamicInputList,
    // Cascader,
  }
};
</script>
