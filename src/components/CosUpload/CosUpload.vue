<template>
  <div class="ocm-cos-upload">
    <div class="upload">
      <slot v-if="$slots.default"></slot>
      <span v-else>像素{{pixel}}，{{ fileFormat.toUpperCase() }}格式，{{fileMaxSize / 1024}}K以内</span>
      <label :for="`cosUpload${Date.now()}`">
        <el-button :disabled="disableStatus" plain>选择文件</el-button>
        <input class="file-input" type="file" :disabled="disableStatus" :accept="acceptType" ref="inputFile" :multiple="multiple" @change="handleChange" :id="`cosUpload${Date.now()}`">
      </label>
    </div>
    <ul class="preview" v-if="Object.keys(fileUrlList).length">
      <template v-for="(item, keyName) in fileUrlList">
        <li :key="keyName" v-if="item.url">
          <video v-if="fileFormat === 'mp4'" :src="item.url" width='100%' height='100%' preload='meta' controls />
          <img v-if="fileFormat === 'jpg'" :src="item.url" alt="" />
<!--          <span class="resId" v-if="item.resId">{{item.resId}}</span>-->
          <span class="close el-icon el-icon-close" v-if="!disabled" @click="handleRemove(keyName)"></span>
          <template v-if="fileFormat === 'mp4' && item.loading">
            <el-progress type="circle" :stroke-width="15" :percentage="+(+item.percent).toFixed()" color="rgba(255, 85, 0, 0.9)"></el-progress>
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5';
import service from '../../api';
import MP4info from '../../util/mp4info';
const { classroomManagementService } = service;

export default {
  name: 'CosUpload',
  model: {
    prop: 'fileList',
    event: 'change'
  },
  props: {
    fileList: {
      type: Object,
      default: () => {}
    },
    pixel: {
      type: String,
      default: '350*250'
    },
    acceptType: {
      type: String,
      default: 'image/jpeg'
    },
    fileMaxSize: {
      type: Number,
      default: 500 * 1024
    },
    fileLimitNum: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    validateAttr: {
      type: String,
      default: ''
    }
  },
  data() {
    const sn = Object.keys(this.fileList).length;
    return {
      multiple: true,
      bucket: 'openclass-1253210315',
      region: 'ap-shanghai',
      fileUrlList: this.fileList,
      sn
    };
  },
  watch: {
    fileList(val) {
      this.fileUrlList = val;
      this.sn = Object.keys(this.fileList).length;
    }
  },
  computed: {
    dataType() {
      const dataType = {
        jpg: 100,
        mp4: 200,
        mp3: 300,
        txt: 400,
        other: 500
      };
      return +dataType[this.fileFormat];
    },
    disableStatus() {
      return this.sn >= this.fileLimitNum || this.disabled;
    },
    fileFormat() {
      let format = this.acceptType.split('/')[1];
      return format === 'jpeg' ? 'jpg' : format;
    }
  },
  methods: {
    verifyFile (file) {
      return file.size && file.size <= this.fileMaxSize && new RegExp(this.acceptType, 'i').test(file.type);
    },
    handleFile(file) {
      this.sn++;
      if (this.sn > this.fileLimitNum) {
        this.sn--;
        return;
      }
      if (!this.verifyFile(file)) {
        // this.$message.warning(`文件${file.name}格式只能为${this.fileFormat}，且最大为${this.fileMaxSize / 1024 / 1024}M，请重新上传`);
        this.$message.warning(`最大可上传${this.fileMaxSize / 1024 / 1024}M，请重新上传`);
        this.sn--;
        return;
      }
      const currentKey = `${file.name}-${file.lastModified}-${file.size}`;
      const handlePreview = () => {
        return new Promise((resolve, reject) => {
          this.preview(file).then((base64Url) => {
            this.$set(this.fileUrlList, currentKey, {
              url: base64Url,
              resId: '',
              loading: true,
              percent: 0
            });
            resolve();
          }).catch(() => {
            this.sn--;
            reject();
          });
        })
      };

      handlePreview().then(() => {
        this.uploadFile(file).then(({ url, resId }) => {
          this.$set(this.fileUrlList, currentKey, {
            url: url,
            resId: resId,
            loading: false,
            percent: 100
          });
          this.$emit('change', Object.assign({}, this.fileUrlList));
          this.$emit('validateField', this.validateAttr);
        }).catch(() => {
          this.sn--;
          if (this.fileUrlList.currentKey) {
            delete this.fileUrlList.currentKey;
          }
        })
      });
    },
    handleChange (e) {
      const input = e.target;
      const files = input.files;
      if (!files.length) {
        return;
      }
      [...files].forEach((file) => {
        this.handleFile(file);
      });
    },
    preview (file) {
      let reader = new FileReader();
      return new Promise((resolve, reject) => {
        if (this.fileFormat === 'jpg') {
          reader.addEventListener('load', () => {
            resolve(reader.result);
          });
          reader.readAsDataURL(file);
        }
        if (this.fileFormat === 'mp4') {
          reader.addEventListener('load', () => {
            const info = MP4info(reader.result);
            resolve(info);
          });
          reader.readAsArrayBuffer(file);
        }
      })
    },
    uploadFile: function (file) {
      return new Promise((resolve, reject) => {
        const dataType = this.dataType;
        this.cos = new COS({
          getAuthorization: (options, callback) => {
            classroomManagementService.getTempKey({ dataType }).then((res) => {
              if (res.code === 200) {
                const { credentials: { sessionToken, tmpSecretId, tmpSecretKey }, expiredTime } = res.data;
                callback({
                  XCosSecurityToken: sessionToken,
                  TmpSecretId: tmpSecretId,
                  TmpSecretKey: tmpSecretKey,
                  ExpiredTime: expiredTime
                });
              } else {
                this.$message({
                  message: `文件上传授权失败，${res.msg}`,
                  type: 'warning'
                })
              }
            }).catch((e) => {
              reject();
              this.$message({
                message: '文件上传授权失败，请检查网络之后重试',
                type: 'warning'
              })
            })
          },
          // FileParallelLimit: 5,
          ChunkSize: 5242880
        });
        classroomManagementService.getFileName({
          fileName: Date.now() + '_' + file.name,
          dataType
        }).then((response) => {
          if (response.code === 200) {
            let res = response.data;
            let newName = res.cosPath;
            let tkId = 0;
            this.cos.sliceUploadFile({
              Bucket: this.bucket,
              Region: this.region,
              Key: newName,
              Body: file,
              TaskReady: function (taskId) {
                tkId = taskId;
              },
              onProgress: (progressData) => {
                const currentKey = `${file.name}-${file.lastModified}-${file.size}`;
                this.fileUrlList[currentKey].percent = progressData.percent * 100;
              }
            }, (err) => {
              if (err) {
                this.$message({
                  message: '文件上传失败，请检查网络之后重试',
                  type: 'error'
                });
                this.cos.cancelTask(tkId);
                reject();
              } else {
                resolve({
                  url: `//${res.cdnHost}${newName}`,
                  resId: res.resId
                })
              }
            })
          }else {
            console.log(response);
          }
        }).catch(err => {
          debugger;
          console.log(err);
        })
      })
    },
    handleRemove(keyName) {
      const typeText = this.fileFormat === 'mp4' ? '视频' : '图片';
      this.$confirm(`此操作将删除该${typeText}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sn--;
        this.$refs['inputFile'].value = '';
        this.$message({
          type: 'success',
          message: `删除成功！`
        });
        const temp = Object.assign({}, this.fileUrlList);
        delete temp[keyName];
        this.fileUrlList = temp;
        this.$emit('change', Object.assign({}, this.fileUrlList));
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消！`
        });
      });
    }
  }
}
</script>
