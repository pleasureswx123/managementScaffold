import axios from 'axios';
import { Message } from 'element-ui';
import HOSTS from '../config/hots.js'

let cancel;
const promiseArr = {};
const { CancelToken } = axios;

const instance = axios.create({
  baseURL: '/',
  responseType: 'json',
  withCredentials: true,
  headers: {
    'env': HOSTS.webOrigin,
    'Content-Type': 'application/json;charset=UTF-8'
  },
  timeout: 3000
});

instance.interceptors.request.use(function (request) {
  if (request.method === 'get' && request.params && !request.params._t) {
    request.params._t = Date.now()
  }
  if (request.url) {
    if (promiseArr[request.url]) {
      console.log(request.url);
      // promiseArr[request.url]('操作取消');
    }
    promiseArr[request.url] = cancel;
  }
  return Promise.resolve(request);
}, function (error) {
  return Promise.reject(error)
});

instance.interceptors.response.use((response) => {
  if (response.status === 200) {
    return Promise.resolve(response.data);
  } else {
    Message.error(`response.status: ${response.status}`);
    return Promise.reject(response);
  }
}, (error) => {
  return Promise.reject(error);
});

const request = {
  get(url, params = {}) {
    return new Promise((resolve, reject) => {
      instance({
        method: 'get',
        url,
        params,
        cancelToken: new CancelToken((c) => {
          cancel = c;
        })
      }).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    })
  },
  post(url, params = {}) {
    return new Promise((resolve, reject) => {
      instance({
        method: 'post',
        url,
        data: params,
        cancelToken: new CancelToken((c) => {
          cancel = c;
        })
      }).then((response) => {
        return resolve(response);
      }).catch((error) => {
        return reject(error);
      });
    })
  }
};

export default request;
