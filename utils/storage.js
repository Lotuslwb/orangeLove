/**
 * Created by nixuan on 2018/4/23.
 */
import store from 'store';
const data = {};

const getter = (field) => {
    const storageKey = `_${field}`;
    if (data[storageKey]) {
        return data[storageKey];
    }
    const storageVal = store.get(field);
    if (storageVal) {
        data[storageKey] = storageVal;
        return data[storageKey];
    }
    return null;
};

const setter = (field, val) => {
    const storageKey = `_${field}`;
    data[storageKey] = val;
    store.set(field, val);
};

const UserInfo = {
    get: () => {
        return getter('userInfo')
    },
    getId: () => {
        const userInfo = getter('userInfo');
        if (userInfo) {
            return userInfo.userId;
        }
        return null;
    },
    set: (userInfo) => {
        setter('userInfo', userInfo)
    },
    getBrief: () => {
        return getter('briefInfo');
    },
    setBrief: (briefInfo) => {
        setter('briefInfo', briefInfo);
    }
};

const AddressInfo = {
    get: () => {
        return getter('addressInfo');
    },
    set: (addressInfo) => {
        setter('addressInfo', addressInfo);
    }
};

export default {
    UserInfo,
    AddressInfo
};
