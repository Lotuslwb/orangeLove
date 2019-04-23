import React from 'react';
import {inject, observer} from 'mobx-react';
import Link from 'next/link';
import {
    NavBar, List, InputItem, WhiteSpace, WingBlank, Button, Toast, Flex, Radio, Result, Icon,
    TextareaItem, Calendar, Card
} from 'antd-mobile';
import {createForm} from 'rc-form';
import PageWrapper from '@components/PageWrapper';
import RedPacketType from '@constants/RedPacketType';
import agent from "@utils/agent";
import './index.less';
import pageStore from './store';
import storage from '@utils/storage';
import Router from 'next/router'
import VoteStatus from "../../../constants/VoteStatus";

const RadioItem = Radio.RadioItem;

@observer
class Page extends React.Component {

    constructor(props) {
        super(props);

        const {query} = this.props;
        this.voteId = null;
        if (query.voteId) {
            this.voteId = query.voteId;
        }

        this.state = {
            type: RedPacketType.LUCK,
            submitSuccess: false,
            optionCount: 1,
            showCalendar: false
        };
    }

    componentDidMount() {
        const user = storage.UserInfo.get();
        pageStore.getDetail(this.voteId, user.userId);
    }

    handleBinding = () => {
        const userInfo = storage.UserInfo.get();
        agent.Merculet.getBindingUrl(userInfo.userId)
            .then(data => {
                Router.replace(data);
            });
    };

    handleSubmit = () => {
        const {selectedOptionId} = pageStore;
        console.log(selectedOptionId);
        if (!selectedOptionId) {
            return;
        }
        const userInfo = storage.UserInfo.get();
        if (selectedOptionId) {
            agent.Vote.cast(this.voteId, {
                userId: userInfo.userId,
                voteId: this.voteId,
                voteOptionId: selectedOptionId
            })
                .then(data => {
                    Toast.success('投票成功');
                })
                .catch(err => {
                    Toast.fail(err.message);
                });
        }
    };

    render() {
        const {vote} = pageStore;
        const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt=""/>;
        return (
            <>
            {/*<Button type="primary" onClick={this.handleBinding.bind(this)}>绑定钱包</Button>*/}
            {
                pageStore.status === VoteStatus.WAIT && (
                    <Result
                        img={myImg('/static/img/wait.png')}
                        title="还未开始"
                        message={vote.content}
                    />
                )
            }
            <WingBlank size="lg">
                <WhiteSpace size="lg"/>
                <Card>
                    <Card.Header
                        title={vote.title}
                    />
                    <Card.Body>
                        <div>{vote.content}</div>
                    </Card.Body>
                </Card>
                <List renderHeader={() => '选项'}>
                    {(vote.options || []).map(option => {
                        return (
                            <RadioItem key={option.id}
                                       checked={pageStore.selectedOptionId === option.id}
                                       onChange={() => pageStore.select(option.id)}>
                                <div className="option">
                                    <div className="option__name">{option.name}</div>
                                    <div className="option__count">票数: {option.count || 0}</div>
                                </div>
                            </RadioItem>
                        );
                    })}
                </List>
                <WhiteSpace/>
                <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            </WingBlank>
            </>
        )
    }

}

export default PageWrapper(createForm()(Page));
