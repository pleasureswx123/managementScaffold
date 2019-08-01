<template>
  <div class="ocm-pdf-list">
    <div class="list-page">
      <ocm-search v-model="searchnParmas" @search="search" :hiddenUploadStatus="hiddenUploadStatus">
        <pdf-upload-dialog v-if="!hiddenUploadStatus" @successUploadGetData="successUploadGetData" :selectionList="selectionList" :creatorId="creatorId" :vendorId="vendorId" @handleDelDoc="handleDelDoc"></pdf-upload-dialog>
      </ocm-search>
      <table-box
        :hiddenUploadStatus="hiddenUploadStatus"
        v-model="selectionList"
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
import moment from 'moment';
import OcmSearch from '../../components/Search';
import TableBox from '../../components/TableBox';
import Pagination from '../../components/Pagination';
import PdfUploadDialog from '../../prefabs/PdfUploadDialog';
import service from '../../api';

const { classroomManagementService } = service;

export default {
  name: 'PdfList',
  props: ['creatorId', 'vendorId', 'hiddenUploadStatus'],
  data() {
    const formatterUploadTime = (row, column) => {
      return row.uploadTime && moment(row.uploadTime).format('YYYY-MM-DD HH:mm');
    };
    return {
      selectionList: [],
      searchnParmas: {
        initParams: {
          docId: '',
          docName: ''
        },
        tags: {
          docId: {
            tag: 'el-input',
            type: 'text',
            placeholder: '课件ID'
          },
          docName: {
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
            prop: 'docId',
            label: '课件Id',
            fixed: true,
            sortable: true,
            width: '280'
          },
          {
            prop: 'docName',
            label: '课件名称',
            sortable: true,
            overflow: true
          },
          {
            prop: 'docPreviewUrl',
            label: '地址',
            width: '100',
            overflow: true
          },
          {
            prop: 'docSize',
            label: '课件大小',
            width: '100'
          },
          {
            prop: 'uploadTime',
            label: '上传时间',
            formatter: formatterUploadTime,
            sortable: true,
            width: '120'
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
    const pars = this.changeParams(Object.assign({}, this.searchnParmas.initParams, this.defaultPaginationParmas));
    this.getData(pars);
  },
  methods: {
    changeParams(pars) {
      const { currentPage, pageSize, docId, docName } = pars;
      const params = { currentPage, pageSize, docId, docName };
      return params;
    },
    successUploadGetData() {
      const pars = this.changeParams(Object.assign({}, this.searchnParmas.initParams, this.defaultPaginationParmas));
      this.getData(pars);
    },
    // 翻页
    getCurrentPageData({ currentPage }) {
      const pars = this.changeParams(Object.assign({}, this.searchnParmas.initParams, { currentPage, pageSize: 10 }));
      this.getData(pars);
    },
    // 搜索
    search(params) {
      const pars = this.changeParams(Object.assign({}, params, { currentPage: 1, pageSize: 10 }));
      this.getData(pars)
    },
    initPage({ total = 0, currentPage = 1 }) {
      this.defaultPaginationParmas = {
        currentPage,
        pageSize: 10,
        total
      }
    },
    // 列表数据
    getData(params) {
      return classroomManagementService.getStaticdocList(params).then(res => {
        const { code, data: { docArray = [], total = 0, currentPage }, msg } = res;
        if (code === 200) {
          this.table.lists = docArray;
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
        console.log(err);
      });
    },
    del(index, { docId }) {
      if (Object.prototype.toString.call(docId) === '[object String]') {
        docId = [ docId ]
      }
      this.$confirm(`此操作将删除课件, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        classroomManagementService.delStaticdoc({ docId }).then(res => {
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
    handleDelDoc() {
      const docId = this.selectionList.map(doc => doc.docId);
      this.del(-1, { docId });
    }
  },
  components: {
    OcmSearch,
    TableBox,
    Pagination,
    PdfUploadDialog
  }
}
</script>
