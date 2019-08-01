<template>
  <div class="ocm-search">
    <template v-for="(item, key) in searchnParmas.tags">
      <component
        :is="item.tag" :key="key"
        v-model="searchnParmas.initParams[key]" clearable :type="item.type" :placeholder="item.placeholder" :format="item.format"
        :limitCondition="item.limitCondition"
      ></component>
    </template>
    <template v-if="searchnParmas.buttons.length">
      <div>
        <el-button
          v-for="(item, key) in searchnParmas.buttons"
          :key="key" :type="item.type"
          @click="handleClick(item.clickName)"
        >{{item.text}}</el-button>
      </div>
    </template>
    <slot v-if="$slots.default"></slot>
  </div>
</template>

<script>
import DatePicker from '../DatePicker';
import DateTimeRange from '../TimeRange';

export default {
  name: 'Search',
  model: {
    prop: 'searchnParmas',
    event: 'change'
  },
  props: {
    searchnParmas: {
      required: true,
      type: Object,
      default: () => ({
        initParams: {
          roomId: '',
          roomName: '',
          teacherName: '',
          rangeTime: []
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
      })
    }
  },
  data() {
    return {
      defaultParams: Object.assign({}, this.searchnParmas.initParams)
    }
  },
  methods: {
    handleClick(eventName) {
      this[eventName]();
    },
    reset() {
      this.$emit('change', Object.assign({}, this.searchnParmas, { initParams: this.defaultParams }));
      this.$emit('search', this.defaultParams);
    },
    search() {
      this.$emit('search', this.searchnParmas.initParams);
    }
  },
  components: {
    DatePicker,
    DateTimeRange
  },
  watch: {
    searchnParmas(val) {
      this.defaultParams = Object.assign({}, val.initParams);
    }
  }
}
</script>
