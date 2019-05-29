import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import Router from 'next/router';
import store from 'store';
import { Toast } from 'antd-mobile';
import storage from './storage';
import { getCookie } from '@utils/utils';

const superagent = superagentPromise(_superagent, global.Promise);

const encode = encodeURIComponent;

const getAppParams = () => {
  const userInfo = storage.UserInfo.get();
  const params = {};
  if (userInfo) {
    params.tk = userInfo.token || '';
  }
  return params;
};

class MyError extends Error {
  code = 0;

  constructor(code, message) {
    super();
    this.message = message;
    this.code = code;
  }
}

const tokenPlugin = req => {
  // const tk = getCachedToken();
  // if (tk) {
  //     req.set('authorization', `Token ${tk}`);
  // }
};

const handleErrors = err => {
  // if (err && err.response && err.response.status === 401) {}
  // return err;
};

const responseBody = res => {
  const body = res.body;
  if (body.errno === 401) {
    store.clearAll();
    return Wechat.getAuthorizationUrl().then(data => {
      Router.replace(data);
      return {};
    });
  } else if (body.errno === 0) {
    return body.data;
  } else {
    alert(body);
    Toast.info(body.errmsg);
    return null;
  }
  // else {
  //   throw new MyError(body.errno, body.errmsg);
  // }
};

const requests = {
  del: (url, body, params) =>
    superagent
      .del(`${url}`, body)
      .query({
        ...params,
        ...getAppParams()
      })
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  get: (url, params) =>
    superagent
      .get(`${url}`)
      .query({
        ...params,
        ...getAppParams()
      })
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${url}`, body)
      .query({
        ...params,
        ...getAppParams()
      })
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  post: (url, body, params) =>
    superagent
      .post(`${url}`, body)
      .query({
        ...params,
        ...getAppParams()
      })
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody)
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;

const host = 'http://house.t.gegosport.com/evaluation/wx';
// const host = 'http://47.99.64.137:8360/evaluation/wx';
// const host = 'http://47.99.64.137:8080/evaluation';
// const host = 'http://localhost:8080/evaluation';

const Wechat = {
  getConfig: () => {
    const url = encodeURIComponent(window.location.href.split('#')[0]);
    return requests.get(`${host}/config?url=${url}`);
  },
  getAuthorizationUrl: () => {
    return requests.get(`${host}/auth_url`);
  },
  login: (code, fromId) => {
    return requests.get(`${host}/login?${fromId ? `fromId=${fromId}` : ''}`, {
      code
    });
  }
};

const Baby = {
  add: params => {
    return requests.post(`${host}/baby`, params);
  },
  get: () => {
    return requests.get(`${host}/baby`);
  },
  getReport: () => {
    return requests.get(`${host}/report`);
  },
  unlock: params => {
    return requests.post(`${host}/unlock`, params);
  }
};

const Question = {
  getList: () => {
    return requests.get(`${host}/question`);
  },
  answer: (questionId, answer) => {
    return requests.post(`${host}/question/${questionId}/answer/${answer}`);
  },
  answerList: params => {
    return requests.post(`${host}/answer`, params);
  }
};

const Answer = {
  getList: () => {
    return requests.get(`${host}/answer/list`);
  }
};

const Report = {
  getByAttr: attrId => {
    return requests.get(`${host}/attr_report?attr=${attrId}`);
  },
  getPayParams: (type) => {
    return requests.post(`${host}/payment?type=${type}&groupid=${getCookie('groupid') || '1'}`);
  },
  queryOrderStatus: (orderid) => {
    return requests.get(`${host}/payment?out_trade_no=${orderid}`);
  }
};

const System = {
  getGroup: (id) => {
    return requests.get(`${host}/group?groupid=${id}`);
  }
};

export default {
  Wechat,
  Baby,
  Question,
  Answer,
  Report,
  System
};
