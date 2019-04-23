import React from 'react';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import {
    NavBar, List, InputItem, WhiteSpace, WingBlank, Button, Toast, Flex, Radio, Result, Icon,
    TextareaItem, Calendar, Card, DatePickerView, DatePicker, Modal
} from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment';
import classNames from 'classnames';
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

        const { query } = this.props;
        if (query.voteId) {
            this.voteId = query.voteId;
        }

        this.state = {
            birthday: new Date(),
            phoneError: false,
            name: '测试',
            phone: '13388283940',
            gender: 1,
            hasReport: false,
        };
    }

    async componentDidMount() {
        try {
            const report = await agent.Baby.getReport();
            // 有报告，后期改成查询用户信息接口
            if (report.attrList) {
                this.setState({
                    hasReport: true,
                })
            }
            let labels = [];
            const emptyLabels = [];
            const attrData = [];
            (report.attrList || []).forEach(attr => {
                labels.push(attr.attrName);
                attrData.push(attr.score);
                emptyLabels.push('');
            });
            if (report.shareCount < 3) {
                labels = emptyLabels
            }
            const radarData = {
                labels,
                datasets: [
                    {
                        label: "My Second dataset",
                        fillColor: "rgba(234,135,68,0.2)",
                        strokeColor: "rgba(234,135,68,.8)",
                        pointColor: "rgba(234,135,68,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: attrData
                    }
                ]
            };
            const doughnutData = [
                {
                    value: 90,
                    color: "#57ddb1",
                    highlight: "#57ddb1",
                    label: '90'
                },
                {
                    value: 10,
                    color: "rgba(255, 255, 255, 0)",
                    highlight: "#5AD3D1",
                    label: "Green"
                }];
            this.setState({
                report,
                radarData,
                doughnutData,
            });
        } catch (e) {

        } finally {

        }

    }

    onPhoneErrorClick = () => {
        if (this.state.phoneError) {
            Toast.info('请输入正确的手机号');
        }
    }
    changePhone = (value) => {
        if (value.replace(/\s/g, '').length < 11) {
            this.setState({
                phoneError: true,
            });
        } else {
            this.setState({
                phoneError: false,
            });
        }
        this.setState({
            phone: value,
        });
    }
    changeBirthday = (value) => {
        if (moment(value).add(1, 'y').isAfter(new Date())) {
            this.setState({
                birthday: value,
            });
        } else {
            Toast.info('本测评只支持0~12个月宝宝');
        }

    }

    handleSubmit = async () => {
        try {
            const { hasReport, birthday, name, phone, gender } = this.state;
            if (hasReport) {
                Router.push('/summary');
            } else {
                // 提交前再次校验
                if (phone.replace(/\s/g, '').length < 11) {
                    Toast.info('请输入正确的手机号');
                    return
                }
                const params = {
                    birthday: birthday.getTime(),
                    name, gender, phone
                };
                const data = await agent.Baby.add(params);
                Router.push('/question');
            }

        } catch (e) {

        } finally {

        }
    };
    // validateDatePicker = (rule, date, callback) => {
    //     if (moment(date).add(1, 'y').isAfter(new Date())) {
    //         callback();
    //     } else {
    //         callback(new Error('本测评只支持0~12个月宝宝'));
    //     }
    // }
    chooseGender = (gender) => {
        if (!this.state.hasReport) {
            this.setState({
                gender,
            })
        }
    }
    render() {
        const { hasReport, birthday, gender, phoneError, phone } = this.state;
        const CustomChildren = ({ extra, onClick, children }) => (
            <div
                onClick={onClick}
                style={{ backgroundColor: '#fff', height: '45px', lineHeight: '45px', padding: '0 15px' }}
            >{extra}</div>
        );
        return (
            <div className={styles.page}>
                <div>
                    <img className={styles.head} src='/static/img/baby/head.png' />
                </div>
                <div className={styles.card}>
                    <div className={styles.card__body}>
                        <div className={styles.item}>
                            <div className={styles.label}>宝宝生日</div>
                            <DatePicker
                                // {...getFieldProps('birthday', {
                                //     initialValue: new Date(),
                                //     rules: [
                                //         { required: true, message: '请选择出生日期' },
                                //         { validator: this.validateDatePicker },
                                //     ],
                                // })}
                                mode="date"
                                format="YYYY-MM-DD"
                                title="请选择日期"
                                value={birthday}
                                onChange={this.changeBirthday}
                                extra="请点击选择"
                                disabled={hasReport}
                            >
                                <CustomChildren />
                            </DatePicker>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>宝宝性别</div>
                            <div className={styles.inline}>
                                <div className={styles['gender-wrapper']} onClick={() => this.chooseGender(1)}>
                                    <img className={styles.item__gender} src="/static/img/icon/boy.png" />
                                    <img className={styles.item__checked} style={gender == 1 ? { display: 'block' } : { display: 'none' }} src="/static/img/icon/selected.png" />
                                </div>
                                <div className={styles['gender-wrapper']} onClick={() => this.chooseGender(2)}>
                                    <img className={styles.item__gender} src="/static/img/icon/girl.png" />
                                    <img className={styles.item__checked} style={gender == 2 ? { display: 'block' } : { display: 'none' }} src="/static/img/icon/selected.png" />
                                </div>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>宝宝昵称</div>
                            <InputItem
                                className={styles.item__name}
                                placeholder=""
                                value={this.state.name}
                                onChange={v => this.setState({ name: v })}
                                disabled={hasReport}
                            >
                            </InputItem>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.label}>手机号</div>
                            <InputItem
                                type="phone"
                                className={styles.item__name}
                                placeholder=""
                                value={phone}
                                error={phoneError}
                                onErrorClick={this.onPhoneErrorClick}
                                onChange={this.changePhone}
                                disabled={hasReport}
                            >
                            </InputItem>
                        </div>
                        <div className={styles.submit} onClick={this.handleSubmit}>{hasReport ? '查看报告' : '开始测试'}</div>
                    </div>
                </div>
            </div>
        )
    }

}

export default PageWrapper(createForm()(Page));
