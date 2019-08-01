const locationHostName = window.location.hostname;
let ENVIROMENT = locationHostName.replace(/^([^-]+)-.*$/gi, '$1');

if (ENVIROMENT === 'test' && process.env.NODE_ENV === 'development') {
  ENVIROMENT = process.env.VUE_APP_ENVIRONMENT;
}
if (locationHostName === '{{projectName}}.{{company}}.com.cn') {
  ENVIROMENT = 'prod';
}
if (locationHostName === 'pre-{{projectName}}.{{company}}.com.cn') {
  ENVIROMENT = 'pre';
}
const webOrigin = window.location.origin;

const CONFIGINFO = {
  [ENVIROMENT]: {
    // sso: `//test-isso.{{company}}-qa.com.cn:9691`,
    sso: `//${ENVIROMENT}-isso.{{company}}-qa.com.cn`,
    // classroomManagementService: 'http://api.mock.{{company}}.com.cn/app/mock/124/api/vps/service/openclass',
    classroomManagementService: '//qa-gw-openclass.{{company}}-qa.com.cn/api/vps/service/openclass',
    ocUrl: 'https://qa-gw-openclass.{{company}}-qa.com.cn/itc/index.html',
    oc2Url: 'https://stage-openclass.{{company}}-qa.com.cn'
  },
  pre: {
    sso: `//pre-sso.{{company}}.com.cn`,
    classroomManagementService: '//openclass-service.{{company}}.com.cn/api/vps/service/openclass',
    ocUrl: 'https://openclass-gateway.{{company}}.com.cn/itc/index.html',
    oc2Url: 'https://pre-openclass.{{company}}.com.cn'
  },
  prod: {
    sso: `//sso.{{company}}.com.cn`,
    classroomManagementService: '//openclass-service.{{company}}.com.cn/api/vps/service/openclass',
    ocUrl: 'https://openclass-gateway.{{company}}.com.cn/itc/index.html',
    oc2Url: 'https://openclass.{{company}}.com.cn'
  }
};

const hostsUrl = CONFIGINFO[ENVIROMENT];

export default Object.assign({}, {
  ENVIROMENT,
  CONFIGINFO,
  webOrigin
},
hostsUrl
);
