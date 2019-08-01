<template>
  <div class="ocm-list">
    <div class="list-page">
      {{searchnParmas.initParams}}
      <div></div>
      {{defaultPaginationParmas}}
      <search v-model="searchnParmas" @search="search">
        <cos-upload-dialog></cos-upload-dialog>
      </search>
      <table-box
        :tableData="table.lists"
        :thData="table.thData"
        :buttons="table.buttons"
        @del="del"
      ></table-box>
      <pagination
        v-model="defaultPaginationParmas"
        @getCurrentPageData="getCurrentPageData">
      </pagination>
    </div>
  </div>
</template>

<script>
import Search from '../../components/Search';
import TableBox from '../../components/TableBox';
import Pagination from '../../components/Pagination';
import CosUploadDialog from '../../prefabs/CosUploadDialog';

export default {
  data() {
    return {
      searchnParmas: {
        initParams: {
          coursewareId: '',
          coursewareName: ''
        },
        tags: {
          coursewareId: {
            tag: 'el-input',
            type: 'number',
            placeholder: '课件ID'
          },
          coursewareName: {
            tag: 'el-input',
            type: 'text',
            placeholder: '课件名称'
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
            prop: 'id',
            label: '课件Id',
            fixed: true,
            sortable: true,
            width: '180'
          },
          {
            prop: 'docName',
            label: '课件名称',
            sortable: true,
            overflow: true
          },
          {
            prop: 'docSize',
            label: '课件大小',
            width: '180'
          },
          {
            prop: 'uploadTime',
            label: '上传时间',
            sortable: true,
            width: '180'
          }
        ],
        buttons: [{
          clickName: 'del',
          text: '删除',
          type: 'default'
        }]
      },
      defaultPaginationParmas: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    const pars = Object.assign({}, this.searchnParmas.initParams, this.defaultPaginationParmas);
    this.getData(pars).then(res => {
      this.defaultPaginationParmas = {
        currentPage: 1,
        pageSize: 10,
        total: res.total // res.total
      }
    });
  },
  methods: {
    // 翻页
    getCurrentPageData({ currentPage }) {
      const pars = Object.assign({}, this.searchnParmas.initParams, { currentPage, pageSize: 10 });
      this.getData(pars);
    },
    // 搜索
    search(params) {
      // { roomId, roomName, teacherName, scheduleDateTime }
      const pars = Object.assign({}, params, { currentPage: 1, pageSize: 10 });
      // 请求接口 后，重置 this.searchnParmas.initParams
      // alert('search')
      this.getData(pars).then(res => {
        this.defaultPaginationParmas = {
          currentPage: 1,
          pageSize: 10,
          total: res.total // res.total
        }
      });
    },
    // 列表数据
    getData(params) {
      console.log(params);
      return new Promise((resolve, reject) => {
        // 发送请求

        setTimeout(() => {
          const result = {
            total: 1000,
            data: [
              {
                'id': '2092',
                'docId': '144a573d-a232-476b-8f72-fa5be577e7e2',
                'docName': 'mp4mp4name.mp4',
                'docSize': 582997,
                'uploadTime': 1557372092526
              }, {
                'id': '2092',
                'docId': '144a573d-a232-476b-8f72-fa5be577e7e2',
                'docName': 'mp4mp4name.mp4',
                'docSize': 582997,
                'uploadTime': 1557372092526
              }, {
                'id': '2092',
                'docId': '144a573d-a232-476b-8f72-fa5be577e7e2',
                'docName': 'mp4mp4name.mp4',
                'docSize': 582997,
                'uploadTime': 1557372092526
              }, {
                'id': '2092',
                'docId': '144a573d-a232-476b-8f72-fa5be577e7e2',
                'docName': 'mp4mp4name.mp4',
                'docSize': 582997,
                'uploadTime': 1557372092526
              }
            ]
          };
          this.table.lists = result.data;
          resolve({
            total: result.total
          });
        }, 1000)
      })
    },
    del(index, { docId }) {
      alert(docId)
      this.$confirm(`此操作将删除该课件, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: `删除成功！`
        });
        // const pars = Object.assign({}, this.searchnParmas.initParams, this.defaultPaginationParmas);
        const pars = Object.assign({}, this.searchnParmas.initParams, { currentPage: 1, pageSize: 10 });
        this.getData(pars).then(res => {
          this.defaultPaginationParmas = {
            currentPage: 1,
            pageSize: 10,
            total: res.total // res.total
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消！`
        });
      });
    },
  },
  components: {
    Search,
    TableBox,
    Pagination,
    CosUploadDialog
  }
}
</script>

<style scoped lang="scss">
  .com-list {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 10px;
    .list-page, .edit-page {
      float: left;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      background: #fff;
      transition: all ease-in 300ms;
    }
    .edit-page {
      width: 0;
      opacity: 0;
    }
    .list-page {
      padding-right: 10px;
      width: 98%;
    }
    &.unfold {
      .list-page {
        width: 40%;
      }
      .edit-page {
        background: #f6f2ee;
        width: 60%;
        opacity: 1;
      }
    }
  }


</style>
