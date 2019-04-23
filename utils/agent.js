import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import storage from "./storage";

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
    if (err && err.response && err.response.status === 401) {}
    return err;
};

const responseBody = (res) => {
    const body = res.body;
    if (body.flag === 1 || body.code === 0) {
        return body.data;
    }
    throw new MyError(body.flag, body.message);
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
        .then(responseBody),
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;

const host = 'http://47.99.64.137:8080/evaluation';
// const host = 'http://localhost:8080/evaluation';

const Wechat = {
    getConfig: () => {
        return requests.get(`${host}/wx_mp/config`);
    },
    getAuthorizationUrl: () => {
        return requests.get(`${host}/wx_mp/auth_url`);
    },
    login: (code, fromId) => {
        return requests.get(`${host}/wx_mp/login?${fromId ? `fromId=${fromId}` : ''}`, {
            code
        });
    }
};

const Baby = {
    add: (params) => {
        return requests.post(`${host}/baby`, params);
    },
    get: () => {
        return requests.get(`${host}/baby`);
    },
    getReport: () => {
        return requests.get(`${host}/baby/report`);
    }
};

const Question = {
    getList: () => {
        return requests.get(`${host}/question/list`);
    },
    answer: (questionId, answer) => {
        return requests.post(`${host}/question/${questionId}/answer/${answer}`);
    },
    answerList: (params) => {
        return requests.post(`${host}/question/answer`, params);
    }
};

const Answer = {
    getList: () => {
        return requests.get(`${host}/answer/list`);
    }
};

const Report = {
    getByAttr: attrId => {
        return requests.get(`${host}/report/attr/${attrId}`);
    }
};

export default {
    Wechat,
    Baby,
    Question,
    Answer,
    Report,
};