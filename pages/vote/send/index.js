import React from 'react'
import Link from 'next/link'
import {
    NavBar, List, InputItem, WhiteSpace, WingBlank, Button, Toast, Flex, Radio, Result, Icon,
    TextareaItem, Calendar
} from 'antd-mobile';
import {createForm} from 'rc-form';
import PageWrapper from '@components/PageWrapper';
import RedPacketType from '@constants/RedPacketType';
import agent from "@utils/agent";
import dayjs from 'dayjs';
import './index.less';

const RadioItem = Radio.RadioItem;

class Page extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            type: RedPacketType.LUCK,
            submitSuccess: false,
            optionCount: 1,
            showCalendar: false
        };
    }

    componentDidMount() {
    }

    handleAddOption(option) {
        const {optionCount} = this.state;
        this.setState({
            optionCount: optionCount + 1
        });
    }

    handleRemoveOption() {
        const {optionCount} = this.state;
        this.setState({
            optionCount: optionCount - 1
        });
    }

    handleSubmit = () => {
        const {form} = this.props;
        const {startTime, endTime} = this.state;

        form.validateFields(async (err, fieldsValue) => {
            console.log(fieldsValue);
            console.log(startTime);
            console.log(endTime);
            if (err || !startTime || !endTime) {
                return;
            }
            const params = {
                startTime: startTime.getTime(),
                endTime: endTime.getTime(),
            };
            const options = [];
            for (let [key, value] of Object.entries(fieldsValue)) {
                if (!value && Number(value) !== 0) {
                    return;
                }
                if (key.startsWith('option_')) {
                    options.push({
                        name: value
                    });
                } else {
                    params[key] = value;
                }
            }
            params.options = options;
            Toast.loading('请求中...', 30);
            try {
                const data = await agent.Vote.send(params);
                console.log(data);
                this.setState({
                    submitSuccess: true
                });
            } catch (e) {
                // Toast.fail('请求失败...', 0);
            } finally {
                Toast.hide();
            }
        });
    };

    onConfirm = (startTime, endTime) => {
        // document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
        this.setState({
            showCalendar: false,
            startTime,
            endTime,
        });
    };

    onCancel = () => {
        // document.getElementsByTagName('body')[0].style.overflowY = this.originbodyScrollY;
        this.setState({
            showCalendar: false,
            startTime: undefined,
            endTime: undefined,
        });
    };

    render() {
        const {getFieldProps} = this.props.form;
        const {optionCount, startTime, endTime} = this.state;
        const optionEnum = [];
        for (let i = 1; i <= optionCount; ++i) {
            optionEnum.push(i);
        }
        const checked = this.state.type === RedPacketType.LUCK;
        const moneyKeyboardWrapProps = {
            onTouchStart: e => e.preventDefault(),
        };
        const now = new Date();
        return (
            <>
            {!this.state.submitSuccess && (
                <div>
                    <List renderHeader={() => '内容配置'}>
                        <InputItem
                            {...getFieldProps('title', {})}
                            type="text"
                            placeholder="请输入投票标题"
                        >投票标题</InputItem>
                        <TextareaItem
                            {...getFieldProps('content', {})}
                            title="投票内容"
                            placeholder="请输入投票内容"
                            data-seed="logId"
                            autoHeight
                        />

                    </List>
                    <List renderHeader={() => '选项配置'}>
                        {
                            optionEnum.map(i => {
                                return (
                                    <InputItem
                                        {...getFieldProps(`option_${i}`, {})}
                                        type="text"
                                        placeholder="请输入选项内容"
                                    >选项 {i} : </InputItem>
                                );
                            })
                        }
                        <List.Item>
                            <div className="option-handle">
                                <div
                                    className="option-handle__add"
                                    onClick={this.handleAddOption.bind(this)}
                                >+ 新增</div>
                                <div
                                    className="option-handle__remove"
                                    onClick={this.handleRemoveOption.bind(this)}
                                >- 移除</div>
                            </div>
                        </List.Item>
                    </List>
                    <List renderHeader={() => '规则配置'}>
                    </List>
                    <List renderHeader={() => '有效期'}>
                        <List.Item arrow="horizontal"
                                   onClick={() => {
                                       this.setState({
                                           showCalendar: true,
                                       });
                                   }}
                        >{startTime ? `${dayjs(startTime).format('YYYY-MM-DD')} ~ ${dayjs(endTime).format('YYYY-MM-DD')}` : '请选择'}</List.Item>
                    </List>
                    <Calendar
                        visible={this.state.showCalendar}
                        onCancel={this.onCancel}
                        onConfirm={this.onConfirm}
                        onSelectHasDisableDate={this.onSelectHasDisableDate}
                        defaultDate={now}
                        minDate={now}
                        maxDate={new Date(+now + 31536000000)}
                    />
                    <WingBlank>
                        <WhiteSpace/>
                        <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                    </WingBlank>
                </div>
            )}
            {this.state.submitSuccess && (
                <Result
                    img={<Icon type="check-circle" className="spe" style={{fill: '#1F90E6'}}/>}
                    title="红包发送成功"
                    message="所提交内容已成功完成验证"
                />
            )}
            </>
        )
    }

}

export default PageWrapper(createForm()(Page));
