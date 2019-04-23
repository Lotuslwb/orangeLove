/**
 * Created by nixuan on 2017/7/14.
 */
const RedPacketType = {
    NORMAL: 100,
    LUCK: 200,
};

const map = {};
map[RedPacketType.NORMAL] = '普通';
map[RedPacketType.LUCK] = '拼手气';

const options = [];
for (let [val, name] of Object.entries(map)) {
    options.push({
        val: Number(val),
        name
    });
}

RedPacketType.map = map;
RedPacketType.options = options;

RedPacketType.getName = (type) => {
    return map[type] || '未知';
};

RedPacketType.getType = (name) => {
    for (let type in map) {
        if (name === map[type]) {
            return parseInt(type, 10);
        }
    }
};

export default RedPacketType;
