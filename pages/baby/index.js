import React from 'react';
import {inject, observer} from 'mobx-react';
import Link from 'next/link';
import {
    NavBar, List, InputItem, WhiteSpace, WingBlank, Button, Toast, Flex, Radio, Result, Icon,
    TextareaItem, Calendar, Card, DatePickerView, DatePicker, Modal
} from 'antd-mobile';
import {createForm} from 'rc-form';
import PageWrapper from '@components/PageWrapper';
import agent from "@utils/agent";
import styles from './index.less';
import pageStore from './store';
import storage from '@utils/storage';
import Router from 'next/router'

const RadioItem = Radio.RadioItem;

@observer
class Page extends React.Component {

    constructor(props) {
        super(props);

        const {query} = this.props;
        if (query.voteId) {
            this.voteId = query.voteId;
        }

        this.state = {
            birthday: new Date(),
			name: '',
			phone:'',
            gender: 1,
        };
    }

    componentDidMount() {
    }

    onChange = (value) => {
        console.log(value);
        this.setState({value});
    };

    handleSubmit = async () => {
        try {
            const {birthday, name,phone, gender} = this.state;
            const params = {
                birthday: birthday.getTime(),
                name, gender,phone
            };
            const data = await agent.Baby.add(params);
            Router.push('/question');
        } catch (e) {

        } finally {

        }
    };

    render() {
        const CustomChildren = ({extra, onClick, children}) => (
            <div
                onClick={onClick}
                style={{backgroundColor: '#fff', height: '45px', lineHeight: '45px', padding: '0 15px'}}
            >{extra}</div>
        );
        return (
            <div className={styles.page}>
                <div>
                    <img className={styles.head} src='/static/img/baby/head.png'/>
                </div>
                <div className={styles.card}>
                    <div className={styles.card__body}>
                        <div className={styles.item}>
                            <div className={styles.label}>宝宝生日</div>
                            <DatePicker
                                mode="date"
                                format="YYYY-MM-DD"
                                title="Select Time"
                                value={this.state.birthday}
                                onChange={v => this.setState({birthday: v})}
                                extra="click to choose"
                            >
                                <CustomChildren/>
                            </DatePicker>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>宝宝性别</div>
                            <div>
                                <img className={styles.item__gender} src="/static/img/icon/boy.png"/>
                                <img className={styles.item__gender} src="/static/img/icon/girl.png"/>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>宝宝昵称</div>
                            <InputItem
                                className={styles.item__name}
                                placeholder=""
                                value={this.state.name}
                                onChange={v => this.setState({name: v})}
                            >
                            </InputItem>
                        </div>
						<div className={styles.item}>
                            <div className={styles.label}>手机号</div>
                            <InputItem
                                className={styles.item__name}
                                placeholder=""
                                value={this.state.phone}
                                onChange={v => this.setState({phone: v})}
                            >
                            </InputItem>
                        </div>
                        <div className={styles.submit} onClick={this.handleSubmit}>测试</div>
                    </div>
                </div>
            </div>
        )
    }

}

export default PageWrapper(createForm()(Page));
