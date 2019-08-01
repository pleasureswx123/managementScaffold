import _ from 'lodash'
import HOSTS from '../config/hots.js'
import Vue from 'vue'

export const event = new Vue();

export const logOut = window.goToSSOAction = () => {
  _.get()
  const url = `${HOSTS.sso}/logout?redirect_url=${encodeURIComponent(location.href)}`
  location.href = url;
}

export function deepClone(v) {
  return JSON.parse(JSON.stringify(v))
}

export function trimCondition(condition) {
  _.forEach(condition, function(value, key) {
    if (_.isString(value)) {
      condition[key] = value.trim()
    }
    if (_.isArray(value) || _.isObject(value)) {
      condition[key] = trimCondition(value)
    }
  })
  return condition
}

export function loopTree(tree, cb, childrenName = 'children') {
  if (_.isArray(tree)) {
    tree.forEach(v => {
      loopTree(v, cb)
    })
  } else {
    cb(tree)
    if (tree[childrenName]) {
      tree[childrenName].forEach(v => {
        loopTree(v, cb)
      })
    }
  }
}

export function changeFormate(params) {
  var url = []
  Object.keys(params).forEach(item => {
    url.push(`${item}=${params[item]}`)
  });
  return `?${url.join('&')}`
}

export function convertRESTAPI(url, opts) {
  if (!opts || !opts) return url;
  const pathKeys = Object.keys(opts);
  pathKeys.forEach((key) => {
    const r = new RegExp('(:' + key + '|{' + key + '})', 'g');
    url = url.replace(r, opts[key]);
  });
  return url;
}

export function parseUrl(url, options = {}) {
  _.keys(options).forEach(key => {
    url = url.replace(new RegExp(`{${key}}`, 'g'), options[key])
  });
  return url
}

export const resetParams = v => {
  for (let key in v) {
    let result = v[key]
    if (_.isObject(result)) {
      result = {}
    } else if (_.isArray(result)) {
      result = []
    } else {
      result = ''
    }
    v[key] = result
  }
  return v
}

export class Session {
  static getItem(key) {
    if (window.sessionStorage !== null) {
      if (key) {
        return window.sessionStorage.getItem(key);
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  static setItem(key, value) {
    if (window.sessionStorage !== null) {
      try {
        window.sessionStorage.setItem(key, value);
      } catch (error) {
        console.error(error);
      }
    };
  }

  static removeItem(key) {
    if (window.sessionStorage !== null) {
      try {
        window.sessionStorage.removeItem(key);
      } catch (error) {
        console.error(error);
      }
    };
  }

  static removeAll() {
    if (window.sessionStorage !== null) {
      window.sessionStorage.clear();
    };
  }
}

export function windowOpenBlank(url, target) {
  if (target === '_blank') {
    var newPage = window.open('', '');
    newPage.location.href = url;
  } else {
    window.open(url);
  }
}

export class Cache {
  static getItem(key) {
    if (window.localStorage !== null) {
      if (key) {
        return window.localStorage.getItem(key);
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  static setItem(key, value) {
    if (window.localStorage !== null) {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.error(error);
      }
    };
  }

  static removeItem(key) {
    if (window.localStorage !== null) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error(error);
      }
    };
  }

  static removeAll() {
    if (window.localStorage !== null) {
      window.localStorage.clear();
    };
  }
}
