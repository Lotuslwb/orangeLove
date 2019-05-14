import React from 'react';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import {
  NavBar,
  List,
  InputItem,
  WhiteSpace,
  WingBlank,
  Button,
  Toast,
  Flex,
  Radio,
  Result,
  Icon,
  TextareaItem,
  Calendar,
  Card,
  DatePickerView,
  DatePicker,
  Modal
} from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment';
import classNames from 'classnames';
import PageWrapper from '@components/PageWrapper';
import agent from '@utils/agent';
import styles from './index.less';
import pageStore from './store';
import storage from '@utils/storage';
import Router from 'next/router';

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
      name: '',
      mobile: '',
      gender: 1,
      hasReport: false,
      hasInfo: false
    };
  }

  async componentDidMount() {
    try {
      const data = await agent.Baby.get();
      if (data && data.userId) {
        this.setState({
          hasInfo: true,
          birthday: new Date(data.birthday),
          gender: data.gender,
          name: data.name,
          mobile: data.mobile
        });
      }
      const report = await agent.Baby.getReport();
      // 有报告，后期改成查询用户信息接口
      if (report.attrList) {
        this.setState({
          hasReport: true
        });
      }
    } catch (e) {
    } finally {
    }
  }

  onPhoneErrorClick = () => {
    if (this.state.phoneError) {
      Toast.info('请输入正确的手机号');
    }
  };
  changePhone = value => {
    if (value.replace(/\s/g, '').length < 11) {
      this.setState({
        phoneError: true
      });
    } else {
      this.setState({
        phoneError: false
      });
    }
    this.setState({
      mobile: value
    });
  };
  changeBirthday = value => {
    if (
      moment(value)
        .add(6, 'y')
        .isAfter(new Date())
    ) {
      this.setState({
        birthday: value
      });
    } else {
      Toast.info('本测评只支持0~6岁的宝宝');
    }
  };

  handleSubmit = async () => {
    try {
      const { hasReport, hasInfo, birthday, name, mobile, gender } = this.state;
      if (hasReport) {
        Router.push('/summary');
      } else {
        if (!hasInfo) {
          // 提交前再次校验
          if (mobile.replace(/\s/g, '').length < 11) {
            Toast.info('请输入正确的手机号');
            return;
          }
          const params = {
            birthday: birthday.getTime(),
            name,
            gender,
            mobile
          };
          const data = await agent.Baby.add(params);
        }
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
  chooseGender = gender => {
    if (!this.state.hasInfo) {
      this.setState({
        gender
      });
    }
  };
  render() {
    const {
      hasReport,
      hasInfo,
      birthday,
      gender,
      phoneError,
      mobile
    } = this.state;
    const CustomChildren = ({ extra, onClick, children }) => (
      <div
        onClick={onClick}
        className={styles.text}
        style={{
          backgroundColor: '#fff',
          height: '40px',
          lineHeight: '40px',
          color: hasInfo ? '#bbb' : '#507DDC'
        }}
      >
        {extra}{' '}
      </div>
    );
    return (
      <div className={styles.page}>
        <div>
          <img className={styles.head} src="/static/img/baby/head.png" />
        </div>{' '}
        <div className={styles.card}>
          <div className={styles.card__body}>
            <div className={styles.item}>
              <div className={styles.label}> 宝宝生日 </div>{' '}
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
                disabled={hasInfo}
              >
                <CustomChildren />
              </DatePicker>{' '}
            </div>{' '}
            <div className={styles.item}>
              <div className={styles.label}> 宝宝性别 </div>{' '}
              <div className={styles.inline}>
                <div
                  className={styles['gender-wrapper']}
                  onClick={() => this.chooseGender(1)}
                >
                  <img
                    className={styles.item__gender}
                    src="/static/img/icon/boy.png"
                  />
                  <div
                    className={styles.text}
                    style={
                      gender == 1
                        ? {
                            color: '#3366cc'
                          }
                        : {
                            color: '#d9d9d9'
                          }
                    }
                  >
                    男{' '}
                  </div>{' '}
                  {/* <img className={styles.item__checked} style={gender == 1 ? { display: 'block' } : { display: 'none' }} src="/static/img/icon/selected.png" /> */}{' '}
                </div>{' '}
                <div
                  className={styles['gender-wrapper']}
                  onClick={() => this.chooseGender(2)}
                >
                  <img
                    className={styles.item__gender}
                    src="/static/img/icon/girl.png"
                  />
                  <div
                    className={styles.text}
                    style={
                      gender == 2
                        ? {
                            color: '#3366cc'
                          }
                        : {
                            color: '#d9d9d9'
                          }
                    }
                  >
                    女{' '}
                  </div>{' '}
                  {/* <img className={styles.item__checked} style={gender == 2 ? { display: 'block' } : { display: 'none' }} src="/static/img/icon/selected.png" /> */}{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
            <div className={styles.item}>
              <div className={styles.label}> 宝宝昵称 </div>{' '}
              <InputItem
                className={styles.item__name}
                placeholder=""
                value={this.state.name}
                onChange={v =>
                  this.setState({
                    name: v
                  })
                }
                disabled={hasInfo}
              />{' '}
            </div>{' '}
            <div className={styles.item}>
              <div className={styles.label}> 手机号 </div>{' '}
              <InputItem
                type="phone"
                className={styles.item__name}
                placeholder=""
                value={mobile}
                error={phoneError}
                onErrorClick={this.onPhoneErrorClick}
                onChange={this.changePhone}
                disabled={hasInfo}
              />{' '}
            </div>{' '}
            <div className={styles.submit} onClick={this.handleSubmit}>
              {' '}
              {hasReport ? '查看报告' : '开始测试'}{' '}
            </div>{' '}
          </div>{' '}
        </div>{' '}
      </div>
    );
  }
}

export default PageWrapper(createForm()(Page));
