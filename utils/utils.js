/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

// 新增代码
const randomPrefix = () => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let prefix = '';
  for (let i = 0; i < 6; i++) {
    prefix += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return prefix;
};

export const UniqueKey = {
  prefix: randomPrefix,
  generate: (prefix, index) => {
    if (!prefix) {
      prefix = randomPrefix();
    }
    return `${prefix}_${new Date().getTime()}_${index || '0'}`;
  }
};

const isValidNumber = num => {
  const number = +num;
  if (number - number !== 0) {
    return false;
  }
  if (number === num) {
    return true;
  }
  if (typeof num === 'string') {
    if (number === 0 && num.trim() === '') {
      return false;
    }
    return true;
  }
  return false;
};

export const NumberUtils = {
  isValid: isValidNumber,
  isPositive: num => {
    if (isValidNumber(num)) {
      return parseInt(num, 10) > 0;
    }
    return false;
  },
  isNegative: num => {
    if (isValidNumber(num)) {
      return parseInt(num, 10) < 0;
    }
    return false;
  }
};

export const UrlParams = {
  get: (search, field) => {
    const query = search.substr(1);
    const result = {};
    query.split('&').forEach(function(part) {
      const item = part.split('=');
      result[item[0]] = decodeURIComponent(item[1]);
    });
    if (field) {
      return result[field];
    }
    return result;
  }
};

export const isWeixinBrowser = () => {
  const ua = navigator.userAgent.toLowerCase();
  return /micromessenger/.test(ua);
};

// 写cookies
export function setCookie(name, value) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie =
    name + '=' + escape(value) + ';expires=' + exp.toGMTString();
}
//读取cookies
export function getCookie(name) {
  var arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');

  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
}
