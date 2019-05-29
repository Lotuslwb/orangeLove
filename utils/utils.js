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

export function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}
export const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max)) + 1;
};

export const payConfig = (config, sucCb, errCb) => {
  function onBridgeReady() {
    WeixinJSBridge.invoke('getBrandWCPayRequest', config, function(res) {
      if (res.err_msg == 'get_brand_wcpay_request:ok') {
        // 使用以上方式判断前端返回,微信团队郑重提示：
        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        sucCb && typeof sucCb == 'function' && sucCb()
      } else {
        errCb && typeof errCb == 'function' && errCb()
      }
    });
  }
  if (typeof WeixinJSBridge == 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
  } else {
    onBridgeReady();
  }
};