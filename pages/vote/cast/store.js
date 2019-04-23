import {observable, action, computed} from 'mobx';
import agent from '@utils/agent';
import VoteStatus from "../../../constants/VoteStatus";

export class PageStore {

    @observable vote = {};
    @observable selectedOptionId = null;

    @action select(optionId) {
        this.selectedOptionId = optionId;
    }

    @computed get status() {
        if (this.vote.startTime > this.vote.serverTime) {
            return VoteStatus.WAIT;
        } else if (this.vote.serverTime >= this.vote.endTime) {
            return VoteStatus.END;
        } else {
            if (this.vote.userCast) {
                return VoteStatus.CASTED;
            }
            return VoteStatus.ING;
        }
    }

    @action getDetail = async (voteId, userId) => {
        try {
            const data = await agent.Vote.get(voteId, {
                fields: 'options,userCast,castCount',
                userId
            });
            this.vote = data;
            return data;
        } catch (e) {

        } finally {

        }
    }

}

export default new PageStore();