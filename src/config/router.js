const config = [{
  path: '/',
  hide: true,
  redirect: {
    name: 'create'
  }
},
{
  path: '/create',
  meta: {
    title: '创建教室',
    authorityCode: 'OCM'
  },
  name: 'create',
  icon: 'create-roomlist',
  component: () => import(/* webpackChunkName: "create" */ '../views/create/index.vue')
},
{
  path: '/roomList',
  meta: {
    title: '教室列表',
    authorityCode: 'OCM'
  },
  name: 'roomList',
  icon: 'roomlist',
  hideChildren: true,
  component: () => import(/* webpackChunkName: "roomList" */ '../views/roomList/index.vue'),
  children: [
    {
      path: 'edit',
      hide: true,
      meta: {
        title: '编辑教室'
      },
      name: 'edit',
      icon: 'customsettings',
      component: () => import(/* webpackChunkName: "edit" */ '../views/roomDetail/index.vue')
    },
    {
      path: 'view',
      hide: true,
      meta: {
        title: '查看教室'
      },
      name: 'view',
      icon: 'customsettings',
      component: () => import(/* webpackChunkName: "view" */ '../views/roomDetail/index.vue')
    }
  ]
},
{
  path: '/pdf-courseware-list',
  meta: {
    title: 'PDF课件',
    authorityCode: 'OCM'
  },
  name: 'pdfCoursewareList',
  icon: 'pdf',
  component: () => import(/* webpackChunkName: "pdfCoursewareList" */ '../views/pdfCoursewareList/index.vue')
},
// {
//   path: '/video-courseware-list',
//   meta: {
//     title: '视频课件'
//   },
//   name: 'videoCoursewareList',
//   icon: 'video',
//   component: () => import(/* webpackChunkName: "videoCoursewareList" */ '../views/videoCoursewareList/index.vue')
// },
{
  path: '*',
  meta: {
    title: '无权限的页面'
  },
  hide: true,
  name: 'noAuth',
  component: () => import(/* webpackChunkName: "noAuth" */ '../views/noAuth.vue')
}
];

export default config;
