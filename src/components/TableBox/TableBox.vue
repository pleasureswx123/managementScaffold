<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      ref="multipleTable"
      tooltip-effect="dark"
      :row-key="getRowKeys"
      :default-sort = "{prop: 'date', order: 'descending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="isSelection"
        type="selection"
        :reserve-selection='true'
        width="55">
      </el-table-column>

      <template v-for="(item, index) in thData">
        <el-table-column
          v-if="item.prop === 'studentUrl'"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :fixed="item.fixed"
          :sortable="item.sortable"
          :show-overflow-tooltip="item.overflow"
          :formatter="item.formatter"
          :min-width="item.minWidth"
          :width="item.width">
          <template slot-scope="scope">
            <a :href="`${ocUrl}?role=2&locale=zh-CN&roomId=${scope.row.roomId}`"
               :title="`${ocUrl}?role=2&locale=zh-CN&roomId=${scope.row.roomId}`"
               style="marginRight: 10px"
               target="_blank"
            >培训</a>
            <a :href="`${oc2Url}/student/pc/index.html?onlineClassId=${scope.row.ocId}&bizType=1`"
               :title="`${oc2Url}/student/pc/index.html?onlineClassId=${scope.row.ocId}&bizType=1`"
               target="_blank"
            >教学</a>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop === 'teacherUrl'"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :fixed="item.fixed"
          :sortable="item.sortable"
          :show-overflow-tooltip="item.overflow"
          :formatter="item.formatter"
          :min-width="item.minWidth"
          :width="item.width">
          <template slot-scope="scope">
            <a :href="`${ocUrl}?role=1&locale=zh-CN&roomId=${scope.row.roomId}`"
               :title="`${ocUrl}?role=1&locale=zh-CN&roomId=${scope.row.roomId}`"
               style="marginRight: 10px"
               target="_blank"
            >培训</a>
            <a :href="`${oc2Url}/teacher/pc/index.html?onlineClassId=${scope.row.ocId}&bizType=1`"
               :title="`${oc2Url}/teacher/pc/index.html?onlineClassId=${scope.row.ocId}&bizType=1`"
               target="_blank"
            >教学</a>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop === 'playbackUrl'"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :fixed="item.fixed"
          :sortable="item.sortable"
          :show-overflow-tooltip="item.overflow"
          :formatter="item.formatter"
          :min-width="item.minWidth"
          :width="item.width">
          <template slot-scope="scope">
            <a class="playbackIcon vkdiconfont vkdicon-video" v-if="scope.row.roomStatus === 2" :href="`${ocUrl}?role=2&locale=zh-CN&roomId=${scope.row.roomId}`"
               :title="`${ocUrl}?role=2&locale=zh-CN&roomId=${scope.row.roomId}`"
               target="_blank"
            ></a>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop === 'roomStatus'"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :fixed="item.fixed"
          :sortable="item.sortable"
          :show-overflow-tooltip="item.overflow"
          :formatter="item.formatter"
          :min-width="item.minWidth"
          :width="item.width">
          <template slot-scope="scope">
            <div v-if="scope.row.roomStatus === 0">未上课</div>
            <div v-if="scope.row.roomStatus === 1">上课</div>
            <div v-if="scope.row.roomStatus === 2">下课</div>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop === 'docPreviewUrl'"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :fixed="item.fixed"
          :sortable="item.sortable"
          :show-overflow-tooltip="item.overflow"
          :formatter="item.formatter"
          :min-width="item.minWidth"
          :width="item.width">
          <template slot-scope="scope">
            <a :href="scope.row.docPreviewUrl" target="_blank">预览地址</a>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :fixed="item.fixed"
          :sortable="item.sortable"
          :show-overflow-tooltip="item.overflow"
          :formatter="item.formatter"
          :min-width="item.minWidth"
          :width="item.width">
          <!--<template slot-scope="scope">
            <template v-if="item.prop === 'date'">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.date }}</span>
            </template>
            <template>
              <a :href="scope.row.docPreviewUrl" target="_blank">预览地址</a>
            </template>
          </template>-->
        </el-table-column>
      </template>

      <template v-if="buttons.length && !hiddenUploadStatus">
        <el-table-column
          label="操作"
          fixed="right"
          width="160">
          <template slot-scope="scope">
            <template v-for="(item, index) in buttons">
              <template v-if="item.roomEdit">
                <el-button
                  v-if="Date.now() + 1000 * 60 * 30 < scope.row.scheduleDateTime && +scope.row.roomStatus !== 2"
                  :key="index"
                  size="mini"
                  :type="item.type"
                  @click="handleClick(item.clickName, scope.$index, scope.row)">{{item.text}}
                </el-button>
              </template>
              <el-button
                v-else
                :key="index"
                size="mini"
                :type="item.type"
                @click="handleClick(item.clickName, scope.$index, scope.row)">{{item.text}}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </template>

    </el-table>

  </div>
</template>

<script>
import hostsUrl from '../../config/hots';
const ocUrl = hostsUrl.ocUrl;
const oc2Url = hostsUrl.oc2Url;

export default {
  name: 'TableBox',
  model: {
    prop: 'selectionList',
    event: 'change'
  },
  props: {
    isSelection: {
      type: Boolean,
      default: true
    },
    hiddenUploadStatus: {
      type: Boolean,
      default: false
    },
    selectionList: {
      type: Array,
      default: () => []
    },
    thData: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    buttons: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ocUrl,
      oc2Url,
      multipleSelection: this.selectionList || [],
      getRowKeys(row) {
        return row.docId;
      }
    }
  },
  watch: {
    selectionList(val) {
      this.multipleSelection = val;
    }
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('change', val);
    },
    formatter(row, column) {
      return row.address;
    },
    handleClick(clickName, index, row) {
      this.$emit(clickName, index, row);
    }
  }
}
</script>
