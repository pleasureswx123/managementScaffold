<template>
  <el-dropdown class="ocm-logout" @command="doUserPanelAction">
    <span class="el-dropdown-link userCon">
      <span>{{userInfo.name}}</span><i class="vkdiconfont vkdicon-exit2 userdownIcon"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="logout">注销</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>

export default {
  name: 'Logout',
  props: {
    authLogin: {
      required: true,
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data() {
    return {
      visible: false,
      userInfo: this.authLogin.userInfo
    }
  },
  computed: {},
  methods: {
    toggleStatus() {
      this.visible = !this.visible
    },
    doUserPanelAction(command) {
      switch (command) {
        case 'profile':
          location.href = '/account/profile'
          break
        case 'logout':
          this.$confirm('确定登出用户 \'' + this.userInfo.name + '\' ?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.authLogin.logout().catch(res => {
              this.$message.error('注销失败！')
            });
          }).catch(() => {
          });
          break
        case 'notification-center':
          this.notificationShow = true
          break
      }
    }
  }
}
</script>
