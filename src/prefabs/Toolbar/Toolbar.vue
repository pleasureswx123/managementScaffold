<template>
  <div class="ocm-toolbar">
    <div class="isCollapse" @click="change">
      <i class="vkdiconfont vkdicon-caidan3"></i>
    </div>
    <a class="logo" :href="href" target="_blank"></a>
    <h1>{{title}}</h1>
    <logout :authLogin="currentAuthLogin"></logout>
  </div>
</template>
<script>
import Logout from '@/components/Logout';

export default {
  name: 'Toolbar',
  model: {
    prop: 'status',
    event: 'change'
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '后台管理'
    },
    authLogin: {
      required: true,
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isCollapse: this.status,
      href: `${this.authLogin.url.sso}/start`,
      currentAuthLogin: this.authLogin
    };
  },
  methods: {
    change() {
      this.isCollapse = !this.isCollapse;
      this.$emit('change', this.isCollapse);
    }
  },
  components: {
    Logout
  }
};
</script>
