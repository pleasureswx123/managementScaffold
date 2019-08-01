<template>
  <el-menu
    :router="true"
    class="ocm-menu"
    @open="handleOpen"
    :default-active="$route.path"
    @close="handleClose"
    background-color="#f6f2ee"
    text-color="#6a5648"
    :collapse="isCollapse"
    active-text-color="#fb5300"
  >
    <template v-for="(item, k) in navData">
      <template v-if="!item.hide">
        <template v-if="item.hasOwnProperty('children') && Array.isArray(item.children) && item.children.length && !item.hideChildren">
          <el-submenu
            :key="k+'item.path'"
            :index="item.path"
            v-if="hasAuth(item.meta.authorityCode) && !!item.meta.title"
          >
            <router-link
              slot="title"
              tag="div"
              :to="{ name: item.name}"
              :route="{name: item.name}"
            >
              <i :class="['vkdiconfont', `vkdicon-${item.icon}`]"></i>
              <span class="pdlf10">{{item.meta.title}}</span>
            </router-link>

            <template v-for="(chr, i) in item.children">
              <el-menu-item
                :key="k+'-'+i+chr.path"
                v-if="hasAuth(chr.meta.authorityCode) && !!chr.meta.title && !chr.hide"
                :index="item.path + '/' + chr.path"
                :route="{name: chr.name}"
              >{{chr.meta.title}}
              </el-menu-item>
            </template>

          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item
            v-if="hasAuth(item.meta.authorityCode) && !!item.meta.title"
            :route="{name: item.name}"
            :key="k"
            :index="item.path"
          >
            <i :class="['vkdiconfont', `vkdicon-${item.icon}`]"></i>
            <span
              class="pdlf10"
              slot="title"
            >{{item.meta.title}}</span>
          </el-menu-item>
        </template>
      </template>
    </template>
  </el-menu>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    },
    navData: {
      type: Array,
      default: () => []
    },
    authLogin: {
      required: true,
      type: Object,
      default: () => {}
    }
  },
  methods: {
    hasAuth(code = '') {
      return !code || this.authLogin.hasAuth(code);
    },
    getHasActive(p = '') {
      let flag = false;
      const r = this.$route.path || '';
      if (p && r) {
        flag = r.indexOf(`${p}/`) !== -1;
      }
      return flag;
    },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {}
  }
};
</script>
