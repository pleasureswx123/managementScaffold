<template>
  <div class="ocm-list" :class="{unfold: status}">
    <div class="list-page">
      <ocm-search v-model="searchnParmas" @search="handleSearch">
        <el-button type="primary" @click="handleCreateRoom">创建教室</el-button>
<!--        <el-button :disabled="!selectionList.length" @click="handleDelRoom">删除教室</el-button>-->
      </ocm-search>
      <table-box
        v-model="selectionList"
        :tableData="table.lists"
        :thData="table.thData"
        :buttons="table.buttons"
        :isSelection="false"
        @view="view"
        @edit="edit"
        @del="del"
      ></table-box>
      <pagination
        v-model="defaultPaginationParmas"
        @getCurrentPageData="getCurrentPageData">
      </pagination>
    </div>
    <div class="mask">
      <span class="back vkdiconfont vkdicon-arrow-right2" @click="handleBack"></span>
    </div>
    <div class="edit-page">
      <router-view :creatorId="creatorId" :vendorId="vendorId" @infoChange="infoChange"></router-view>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import OcmSearch from '../../components/Search';
import TableBox from '../../components/TableBox';
import Pagination from '../../components/Pagination';
import service from '../../api';

const { classroomManagementService } = service;

export default {
  props: ['creatorId', 'vendorId'],
  data() {
    const formatterScheduleDateTime = (row, column) => {
      return moment(row.scheduleDateTime).format('YYYY-MM-DD HH:mm');
    };
    const formatterDocsNum = (row, column) => {
      return row.staticDocsIns.length + row.videoUrls.length;
    };
    const formatterDuration = (row, column) => {
      const h = Math.floor(+row.duration / 60);
      return `${h ? (h + 'h') : ''}${row.duration % 60}min`;
    };
    // const [ startYear, startMonth, startDay ] = moment().subtract(6, 'days').format('YYYY-MM-DD').split('-');
    // const [ endYear, endMonth, endDay ] = moment().format('YYYY-MM-DD').split('-');
    return {
      changed: false,
      selectionList: [],
      status: '',
      searchnParmas: {
        initParams: {
          roomId: '',
          roomName: '',
          teacherName: '',
          // rangeTime: [new Date(startYear, startMonth - 1, startDay, 0, 0), new Date(endYear, endMonth - 1, endDay, 23, 59)]
          rangeTime: ''
        },
        tags: {
          roomId: {
            tag: 'el-input',
            type: 'text',
            placeholder: '教室ID'
          },
          roomName: {
            tag: 'el-input',
            type: 'text',
            placeholder: '教室名称'
          },
          teacherName: {
            tag: 'el-input',
            type: 'text',
            placeholder: '老师名称'
          },
          rangeTime: {
            tag: 'date-time-range',
            format: 'yyyy-MM-dd HH:mm'
          }
        },
        buttons: [{
          clickName: 'search',
          type: 'primary',
          text: '查询'
        }, {
          clickName: 'reset',
          type: 'default',
          text: '重置'
        }]
      },
      table: {
        lists: [],
        thData: [
          {
            prop: 'roomId',
            label: '教室ID',
            fixed: true,
            overflow: true,
            sortable: true,
            width: '280'
          },
          {
            prop: 'roomName',
            label: '教室名称',
            minWidth: '100',
            sortable: true,
            overflow: true
          },
          {
            prop: 'docsNum',
            label: '课件数量',
            formatter: formatterDocsNum,
            overflow: true,
            width: '70'
          },
          // {
          //   prop: 'roomType',
          //   label: '教室类型',
          //   sortable: true,
          //   width: '150'
          // },
          // {
          //   prop: 'roomLine',
          //   label: '教室线路',
          //   sortable: true,
          //   width: '150'
          // },
          {
            prop: 'scheduleDateTime',
            label: '开始时间',
            sortable: true,
            formatter: formatterScheduleDateTime,
            overflow: true,
            width: '120'
          },
          {
            prop: 'duration',
            label: '使用时长',
            formatter: formatterDuration,
            overflow: true,
            width: '80'
          },
          {
            prop: 'teacherName',
            label: '授课老师',
            overflow: true
          },
          {
            prop: 'roomStatus',
            label: '状态',
            overflow: true,
            width: '60'
          },
          // {
          //   prop: 'introduce',
          //   label: '教室简介',
          //   overflow: true
          // },
          {
            prop: 'inviteCode',
            label: '邀请码',
            width: '100'
          },
          {
            prop: 'studentUrl',
            label: '学生链接',
            overflow: true,
            width: '120'
          },
          {
            prop: 'teacherUrl',
            label: '老师链接',
            overflow: true,
            width: '120'
          }
          // {
          //   prop: 'playbackUrl',
          //   label: '回放',
          //   overflow: true,
          //   width: '45'
          // }
        ],
        buttons: [
          {
            roomEdit: true,
            clickName: 'edit',
            text: '编辑',
            type: 'primary'
          },
          {
            clickName: 'view',
            text: '查看',
            type: 'default'
          }
          // {
          //   clickName: 'del',
          //   text: '删除',
          //   type: 'default'
          // }
        ]
      },
      defaultPaginationParmas: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    const params = this.changeParams(Object.assign({}, this.searchnParmas.initParams, this.defaultPaginationParmas));
    this.getData(params);
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name === 'roomList') {
      this.status = '';
    }
    if (from.name === 'edit') {
      const params = this.changeParams(Object.assign({}, this.searchnParmas.initParams, this.defaultPaginationParmas));
      this.getData(params);
    }
    next();
  },
  methods: {
    handleCreateRoom() {
      this.$router.push({ path: '/create' });
    },
    infoChange(bool) {
      this.changed = !bool;
    },
    changeParams(paramsObj) {
      let { roomId = '', roomName = '', teacherName = '', rangeTime: [ startTime = '', endTime = '' ], currentPage, pageSize } = paramsObj;
      startTime = moment(startTime).valueOf() || 0;
      endTime = moment(endTime).valueOf() || 0;
      const params = {
        currentPage,
        pageSize,
        roomId,
        roomName,
        teacherName,
        startTime,
        endTime
      };
      return params;
    },
    // 翻页
    getCurrentPageData({ currentPage }) {
      const pars = this.changeParams(Object.assign({}, this.searchnParmas.initParams, { currentPage, pageSize: 10 }));
      this.getData(pars);
    },
    // 搜索
    handleSearch(params) {
      // { roomId, roomName, teacherName, scheduleDateTime }
      const pars = this.changeParams(Object.assign({}, params, { currentPage: 1, pageSize: 10 }));
      // 请求接口 后，重置 this.searchnParmas.initParams
      // alert('search')
      this.getData(pars);
    },
    // 列表数据
    getData(params) {
      return classroomManagementService.getRoomList(params).then(res => {
        const { code, data: { roomArray = [], total = 0, currentPage }, msg } = res;
        if (code === 200) {
          this.table.lists = roomArray;
          this.initPage({
            total,
            currentPage
          });
        } else {
          this.$message({
            type: 'warning',
            message: msg
          });
        }
      }).catch(err => {
        console.log(err)
      });
    },
    initPage({ total = 0, currentPage = 1 }) {
      this.defaultPaginationParmas = {
        currentPage,
        pageSize: 10,
        total
      }
    },
    del(index, { roomId }) {
      if (Object.prototype.toString.call(roomId) === '[object String]') {
        roomId = [ roomId ]
      }
      this.$confirm(`此操作将删除该教室, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        classroomManagementService.deleteRoom({ roomId }).then(res => {
          const { code, data, msg } = res;
          if (code === 200) {
            this.$message({
              type: 'success',
              message: `删除成功！`
            });
            const pars = this.changeParams(Object.assign({}, this.searchnParmas.initParams, { currentPage: 1, pageSize: 10 }));
            this.getData(pars);
          } else {
            this.$message({
              type: 'warning',
              message: msg
            })
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消！`
        });
      });
    },
    handleDelRoom() {
      const roomId = this.selectionList.map(room => room.roomId);
      this.del(-1, { roomId });
    },
    view(index, { roomId }) {
      this.status = 'view';
      this.$router.push({ path: '/roomList/view', query: { roomId, pageStatus: 'view' } })
    },
    edit(index, { roomId }) {
      this.status = 'edit';
      this.$router.push({ path: '/roomList/edit', query: { roomId, pageStatus: 'edit' } })
    },
    handleBack() {
      if (this.changed) {
        this.$confirm(`信息有变更，是否放弃所做的修改?`, '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.$router.push({ path: '/roomList' });
        }).catch(() => {
        });
      } else {
        this.$router.push({ path: '/roomList' });
      }
    }
  },
  components: {
    OcmSearch,
    TableBox,
    Pagination
  }
}
</script>

<style scoped lang="scss">
  .ocm-list {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    padding: 20px 10px 10px;
    box-sizing: border-box;
    .list-page, .edit-page {
      float: left;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      background: #fff;
      transition: all ease-in 300ms;
      box-sizing: border-box;
    }
    .list-page {
      padding-right: 10px;
      width: 98%;
    }
    .mask {
      display: none;
    }
    .edit-page {
      width: 0;
      opacity: 0;
    }
    &.unfold {
      /deep/ .el-table--scrollable-x .el-table__body-wrapper {
        overflow: hidden;
      }
      .list-page {
        width: 40%;
      }
      .edit-page {
        position: relative;
        z-index: 10000;
        background: #f6f2ee;
        width: 58%;
        opacity: 1;
      }
      .mask {
        display: block;
        position: absolute;
        z-index: 1000;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.5);
        .back {
          animation: pulseOpacity 1s ease-in 1;
          opacity: 1;
          cursor: pointer;
          background: #f6f2ee;
          display: block;
          position: absolute;
          top: 50%;
          left: 40%;
          width: 30px;
          height: 55px;
          border-radius: 100% 0 0 100% / 50% 0 0 50%;
          transform: translate(-28px, -50%);
          line-height: 55px;
          font-size: 20px;
          color: #fb5300;
          text-indent: 10px;
          box-shadow: -1px 0 8px 1px rgba(0,0,0,.2);
        }
      }
    }
  }

  @keyframes pulseOpacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
