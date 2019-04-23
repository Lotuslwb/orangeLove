/**
 * Created by nixuan on 2017/7/14.
 */
const VoteStatus = {
    WAIT: 100,
    ING: 200,
    CASTED: 210,
    END: 300
};

const map = {};
map[VoteStatus.WAIT] = '还未开始';
map[VoteStatus.ING] = '进行中';
map[VoteStatus.CASTED] = '已投票';
map[VoteStatus.END] = '已结束';

const options = [];
for (let [val, name] of Object.entries(map)) {
    options.push({
        val: Number(val),
        name
    });
}

VoteStatus.map = map;
VoteStatus.options = options;

VoteStatus.getName = (type) => {
    return map[type] || '未知';
};

VoteStatus.getType = (name) => {
    for (let type in map) {
        if (name === map[type]) {
            return parseInt(type, 10);
        }
    }
};

export default VoteStatus;
