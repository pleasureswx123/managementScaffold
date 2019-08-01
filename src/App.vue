<template>
  <el-container
    class="ocm-wrap"
    id="main">
    <el-header height="46px">
      <toolbar :authLogin="authLogin" v-model="isCollapse" :title="title"></toolbar>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <Menu
          :authLogin="authLogin"
          :isCollapse="isCollapse"
          :navData="navData"
        ></Menu>
      </el-aside>
      <el-main class="main-container">
        <router-view :creatorId="creatorId" :vendorId="vendorId"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import _ from 'lodash';
import Toolbar from '@/prefabs/Toolbar';
import Menu from '@/components/Menu';
import vpsAuthLogin from 'vps-auth-login';
import navData from './config/router.js';
import Config from './config/baseConfig.js';

// import service from './api';
// const { classroomManagementService } = service;

const authLogin = vpsAuthLogin();

export default {
  data() {
    return {
      isCollapse: false,
      title: Config.title,
      navData,
      authLogin,
      vendorId: 3,
      creatorId: ''
    };
  },
  created() {
    this.vendorId = 3;
    this.creatorId = _.get(this.authLogin, 'userInfo.id');
    /*
    const params = { businessType: 1, businessName: 'neixun' };
    classroomManagementService.getid(params).then(res => {
      if (res.code === '200' && res.data) {
        let data = JSON.parse(res.data).vendor;
        let { vendorId } = data;
        this.vendorId = vendorId;
        this.creatorId = _.get(this.authLogin, 'userInfo.id');
      }
    }).catch(error => {
      debugger;
      console.log(error);
    });
    classroomManagementService.getnowtime().then(res => {
      console.log('0000', res)
    })*/
  },
  components: {
    Toolbar,
    Menu
  }
};
</script>
