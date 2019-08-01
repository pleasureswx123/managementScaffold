import request from '../util/request.js';
import hostsUrl from '../config/hots.js';
const classroomManagementService = `${hostsUrl.classroomManagementService}`;

export default {
  createRoom: params => request.post(`${classroomManagementService}/vk/ocmanagement/room/create`, params),
  getRoomList: params => request.post(`${classroomManagementService}/vk/ocmanagement/room/list`, params),
  getRoomDetail: params => request.post(`${classroomManagementService}/vk/ocmanagement/room/detail`, params),
  updateRoom: params => request.post(`${classroomManagementService}/vk/ocmanagement/room/update`, params),
  deleteRoom: params => request.post(`${classroomManagementService}/vk/ocmanagement/room/delete`, params),
  changeRoomStatus: params => request.post(`${classroomManagementService}/vk/ocmanagement/room/status`, params),

  uploadUrl: `${classroomManagementService}/vk/ocmanagement/staticdoc/upload`,
  addStaticdoc: params => request.post(`${classroomManagementService}/vk/ocmanagement/staticdoc/add`, params),
  delStaticdoc: params => request.post(`${classroomManagementService}/vk/ocmanagement/staticdoc/delete`, params),
  getStaticdocList: params => request.post(`${classroomManagementService}/vk/ocmanagement/staticdoc/list`, params),
  /*
  * func getTempKey 获取上传时的临时token（默认为图片）
  * type { number } 上传cos的数据类型 100:图片; 200:视频; 300:音频; 400:文本; 500:其他;
  */
  getTempKey: params => request.get(`${classroomManagementService}/vk/ocmanagement/cos/gettempkeys`, params),
  getFileName: params => request.get(`${classroomManagementService}/vk/ocmanagement/cos/getfilename`, params),
  getTearchinfo: params => request.get(`${classroomManagementService}/vk/ocmanagement/tearchinfo`, params)

  // {"businessType":1,"businessName":"neixun"}
  // getid: params => request.post(`/classroomManagementService/s1/v1/vendor/getid`, params),
  // getnowtime: () => request.get(`${classroomManagementService}/vk/ocmanagement/getnowtime`),
};
