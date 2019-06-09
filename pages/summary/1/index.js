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
  Modal,
  ActivityIndicator
} from 'antd-mobile';
import { createForm } from 'rc-form';
import PageWrapper from '@components/PageWrapper';
import RedPacketType from '@constants/RedPacketType';
import agent from '@utils/agent';
import styles from './index.less';
import pageStore from './store';
import storage from '@utils/storage';
import Router from 'next/router';
import { Radar } from 'react-chartjs';
import $ from 'jquery';
import { setCookie, getCookie, getRandomInt, payConfig } from '@utils/utils';
import { starMap } from '@constants/star';

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
      report: {},
      doughnutData: null,
      radarData: null,
      posterVisible: false,
      shareVisible: false,
      testVisiable: false,
      bak: false,
      attrId: 0,
      pro: false,
      invitation: '',
      shared: false,
      shareCount: 0,
      firstId: 0,
      host: '',
      loading: false
    };
  }

  async componentDidMount() {
    try {
      const report = await agent.Baby.getReport();
      let labels = [];
      const emptyLabels = [];
      const attrData = [];
      (report.attrList || []).forEach(attr => {
        labels.push(attr.attrName);
        attrData.push(attr.score);
        emptyLabels.push('');
      });
      // 新改动，无需隐藏雷达图标签
      // if (report.shareCount < 1) {
      //   labels = emptyLabels;
      // }
      if (!getCookie('random')) {
        setCookie('random', getRandomInt(3));
      }
      if (report.attrList && report.attrList.length > 0) {
        this.setState({
          firstId: report.attrList[0].attrId
        });
      }
      const radarData = {
        labels,
        datasets: [
          {
            label: 'My Second dataset',
            fillColor: 'rgba(234,135,68,0.2)',
            strokeColor: 'rgba(234,135,68,.8)',
            pointColor: 'rgba(234,135,68,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(151,187,205,1)',
            data: attrData
          }
        ]
      };
      const doughnutData = [
        {
          value: 90,
          color: '#57ddb1',
          highlight: '#57ddb1',
          label: '90'
        },
        {
          value: 10,
          color: 'rgba(255, 255, 255, 0)',
          highlight: '#5AD3D1',
          label: 'Green'
        }
      ];
      this.setState({
        report,
        radarData,
        doughnutData,
        shareCount: report.shareCount,
        shared: report.shareCount > 0,
        host: window.location.protocol + '//' + window.location.host
      });
      this.combineImg();
    } catch (e) {
    } finally {
    }
  }

  combineImg = () => {
    const that = this;
    this.setState({
      loading: true
    });
    let shareContent = document.getElementById('poster');
    let width = 300; //获取dom 宽度
    let height = 425; //获取dom 高度
    let canvas = document.createElement('canvas'); //创建一个canvas节点
    let scale = 1; //定义任意放大倍数 支持小数
    canvas.width = width * scale; //定义canvas 宽度 * 缩放
    canvas.height = height * scale; //定义canvas高度 *缩放
    let opts = {
      scale, // 添加的scale 参数
      canvas, //自定义 canvas
      logging: false, //日志开关
      width, //dom 原始宽度
      height, //dom 原始高度
      backgroundColor: 'transparent',
      useCORS: true
    };
    canvas.getContext('2d').scale(scale, scale); //获取context,设置scale
    const html2canvas = require('html2canvas');
    html2canvas(shareContent, opts)
      .then(canvas => {
        let IMAGE_URL = canvas.toDataURL('image/png');
        $('#newPoster')
          .attr('src', IMAGE_URL)
          .css('display', 'block');
        $('#original').css('display', 'none');
        $('#qr').css('display', 'none');
        that.setState({
          loading: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  showModal = () => {
    const { testVisiable } = this.state;
    this.setState({
      testVisiable: !testVisiable
    });
  };
  handleModalTest = async () => {
    const { invitation } = this.state;
    // 需要调接口看邀请码是否通过
    const result = await agent.Baby.unlock({
      type: 'qcode',
      value: invitation && invitation.trim().toUpperCase()
    });
    console.log(result);
    if (result) {
      Router.push('/profession');
    }
  };
  handlePay = async () => {
    const payParams = await agent.Report.getPayParams(1);
    this.setState({
      payParams
    });
    const { jsconfig, out_trade_no } = this.state.payParams;
    const sucCb = async () => {
      // 根据订单查询是否支付成功，若成功，若成功，则使用成功的回调，否则使用失败的回调
      const test = await agent.Report.queryOrderStatus(out_trade_no);
      // alert(JSON.stringify(test));
      if (test.trade_state != 'SUCCESS') {
        Toast.info(test.trade_state_desc);
      } else {
        // 刷新页面。解锁的逻辑在后端处理
        window.location.reload();
      }
    };
    const errCb = () => {
      Toast.info('支付失败');
    };
    payConfig(jsconfig, sucCb, errCb);
  };

  handleTest = ({ lock }) => {
    // this.setState({
    //   attrId: attr ? attr.attrId : 0,
    //   pro: !!pro
    // });
    // 新需求，attr通过分享判断，pro通过lock判断
    if (!lock) {
      Router.push('/profession');
      // if (pro) {
      //   Router.push('/profession');
      // } else {
      //   Router.push(`/report?attrId=${attr.attrId}`);
      // }
      return;
    } else {
      this.showModal();
    }
  };

  gotoAttr = ({ attr, lockTopic = true }) => {
    if (!lockTopic) {
      Router.push(`/report?attrId=${attr.attrId}`);
    } else {
      Toast.info('分享给好友解锁优化建议');
    }
  };

  handleOpenPoster = () => {
    this.setState({ posterVisible: true });
  };

  renderPoster = postId => {
    const { posterVisible, host } = this.state;
    return (
      // <div style={posterVisible ? { display: 'block' } : { display: 'none' }}>
      <div>
        <div
          className={styles.mask}
          style={posterVisible ? { right: 0 } : { right: 9999 }}
        />
        <div className={styles['md-wrapper']} style={posterVisible ? { left: '50%' } : { left: -9999 }}>
          <div className={styles.md}>
            <div
              className={styles['md-close']}
              onClick={() => {
                this.setState({ posterVisible: false });
              }}
            >
              <img src="/static/img/close.png" alt="" />
            </div>
            <div className={styles['md-content']} id="poster">
              <img
                id="original"
                src={`/static/img/poster/attr${postId}.jpg`}
                className={styles.post}
              />
              <img
                id="qr"
                className={styles['poster-qr']}
                src={`${getCookie('posterPath')}`}
              />
              <img
                id="newPoster"
                className={styles.newpost}
                style={{ display: 'none' }}
                crossorigin="anonymous"
              />
            </div>
          </div>
          <div className={styles['md-tips']}>
            <div className={styles.line}>长按保存此图到手机</div>
            <div className={styles.line}>发送到朋友圈或好友</div>
          </div>
        </div>
      </div>
    );
  };

  handleAd = () => {
    const url = getCookie('adurl');
    if (url) {
      window.location.href = url;
    } else {
      this.setState({ bak: true });
    }
  };

  render() {
    const {
      report = {},
      doughnutData,
      radarData,
      shareCount,
      shared,
      firstId,
      host,
      loading
    } = this.state;
    const attrList = report.attrList || [];
    if (!attrList.length) return null;
    const attr = attrList[0].attrId;
    const lock = !!!report.unlock;
    const lockTopic = lock && !shared;

    const postId = `${firstId}-${getCookie('random')}`;
    // const attrLen = attrList.length;
    // let summary = `宝贝的优势智能是${attrList[0].attrName}，${
    //   attrList[1].attrName
    // }，${attrList[2].attrName}；`;
    // if (!shared) {
    //   summary += `宝贝在**，**，**有所欠缺，需要进行引导`;
    // } else {
    //   summary += `宝贝在${attrList[attrLen - 3].attrName}，${
    //     attrList[attrLen - 2].attrName
    //   }，${attrList[attrLen - 1].attrName}有所欠缺，需要进行引导`;
    // }

    // const chartData = {
    //     labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
    //     datasets: [
    //         {
    //             label: "My Second dataset",
    //             fillColor: "rgba(151,187,205,0.2)",
    //             strokeColor: "rgba(151,187,205,1)",
    //             pointColor: "rgba(151,187,205,1)",
    //             pointStrokeColor: "#fff",
    //             pointHighlightFill: "#fff",
    //             pointHighlightStroke: "rgba(151,187,205,1)",
    //             data: [28, 48, 40, 19, 96, 27, 100]
    //         }
    //     ]
    // };

    return (
      <>
        {loading && <ActivityIndicator toast text="正在加载" />}{' '}
        <div className={styles.main}>
          <div className={styles.sectionHead}>
            <div className={styles.avatar}>
              <img src={`/static/img/avatar/attr${postId}.png`} alt="" />
            </div>
            {/* <div className={styles.doughnutWrapper}>
              <div className={styles.percent}>{report.percent || ''}</div>
              {doughnutData && (
                <Doughnut
                  data={doughnutData}
                  width={100}
                  height={100}
                  options={{
                    segmentShowStroke: false,
                    percentageInnerCutout: 90,
                    animateRotate: false,
                    legendTemplate: 'test'
                  }}
                />
              )}
            </div> */}
            <div className={styles.sentences}>
              <div>
                哇！您的宝贝
                <span className={styles.highlight}>{report.sentences[0]}</span>
              </div>
              <div>
                在
                <span className={styles.highlight}>{report.sentences[1]}</span>
                上具有天赋特质
              </div>
              <div>
                有望成为下一个
                <span className={styles.highlight}>{starMap[postId]}</span>哦
              </div>
            </div>
            <img
              src="/static/img/btn_poster.png"
              class={styles.showoff}
              onClick={this.handleOpenPoster.bind(this)}
            />
            {/*style={{marginTop: '20px', width: '280px', height: '64px'}}/>*/}
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.radarWrapper}>
              {radarData && (
                <Radar
                  data={radarData}
                  width={250}
                  height={250}
                  options={{
                    legend: {
                      display: false
                    }
                  }}
                />
              )}
            </div>
            <div className={styles.summary}>
              <div className={styles.summaryLabel}>八大智能雷达图</div>
              {/* <div className={styles.summaryContent}>{summary}</div> */}
              <img
                src="/static/img/btn_share.png"
                onClick={() => {
                  this.setState({ shareVisible: true });
                }}
                style={{ marginTop: '20px', width: '165px', height: '24px' }}
              />
            </div>
          </div>
          <div className={styles.sectionMid}>
            <div style={{ fontSize: '20px', textAlign: 'center' }}>
              八大智能
            </div>
            {/* <div className={styles.tips}>
              * 劣势智能如何增强请查看专业版报告
            </div> */}
            <div className={styles.row}>
              {attrList[0] && (
                <div
                  key={`attr-0`}
                  onClick={this.gotoAttr.bind(this, {
                    attr: attrList[0],
                    lockTopic
                  })}
                  className={styles.cell}
                >
                  <div
                    className={styles.icon}
                    style={{
                      backgroundImage: 'url("/static/img/icon/icon_gold.png")'
                    }}
                  />
                  <div className={styles.attr}>{attrList[0].attrName}</div>
                  <div
                    className={styles.bg}
                    style={{
                      backgroundImage:
                        'url("/static/img/icon/icon_' +
                        attrList[0].attrId +
                        '.png")'
                    }}
                  />
                  <div
                    className={styles.bottom}
                    style={{
                      background: '#fd8f37'
                    }}
                  >
                    <div>优化建议 ></div>
                    <img
                      className={styles.lock}
                      style={
                        lockTopic ? { display: 'inherit' } : { display: 'none' }
                      }
                      src={'/static/img/icon/icon_lock01.png'}
                    />
                  </div>
                </div>
              )}
              <div style={{ width: '20px' }} />
              {attrList[1] && (
                <div
                  key={`attr-1`}
                  onClick={this.gotoAttr.bind(this, {
                    attr: attrList[1],
                    lockTopic
                  })}
                  className={styles.cell}
                >
                  <div
                    className={styles.icon}
                    style={{
                      backgroundImage: 'url("/static/img/icon/icon_silver.png")'
                    }}
                  />
                  <div className={styles.attr}>{attrList[1].attrName}</div>
                  <div
                    className={styles.bg}
                    style={{
                      backgroundImage:
                        'url("/static/img/icon/icon_' +
                        attrList[1].attrId +
                        '.png")'
                    }}
                  />
                  <div
                    className={styles.bottom}
                    style={{
                      background: '#fd7d8f'
                    }}
                  >
                    <div>优化建议 ></div>
                    <img
                      className={styles.lock}
                      style={
                        lockTopic ? { display: 'inherit' } : { display: 'none' }
                      }
                      src={'/static/img/icon/icon_lock01.png'}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className={styles.row}>
              {attrList[2] && (
                <div
                  key={`attr-2`}
                  onClick={this.gotoAttr.bind(this, {
                    attr: attrList[2],
                    lockTopic
                  })}
                  className={styles.cell}
                >
                  <div
                    className={styles.icon}
                    style={{
                      backgroundImage: 'url("/static/img/icon/icon_copper.png")'
                    }}
                  />
                  <div className={styles.attr}>{attrList[2].attrName}</div>
                  <div
                    className={styles.bg}
                    style={{
                      backgroundImage:
                        'url("/static/img/icon/icon_' +
                        attrList[2].attrId +
                        '.png")'
                    }}
                  />
                  <div
                    className={styles.bottom}
                    style={{
                      background: '#afe568'
                    }}
                  >
                    <div>优化建议 ></div>
                    <img
                      className={styles.lock}
                      style={
                        lockTopic ? { display: 'inherit' } : { display: 'none' }
                      }
                      src={'/static/img/icon/icon_lock01.png'}
                    />
                  </div>
                </div>
              )}
              <div style={{ width: '20px' }} />
              {attrList[3] && (
                <div
                  key={`attr-3`}
                  onClick={this.gotoAttr.bind(this, {
                    attr: attrList[3],
                    lockTopic
                  })}
                  className={styles.cell}
                >
                  <div className={styles.attr}>{attrList[3].attrName}</div>
                  <div
                    className={styles.bg}
                    style={{
                      backgroundImage:
                        'url("/static/img/icon/icon_' +
                        attrList[3].attrId +
                        '.png")'
                    }}
                  />
                  <div
                    className={styles.bottom}
                    style={{
                      background: '#5fd8ef'
                    }}
                  >
                    <div>优化建议 ></div>
                    <img
                      className={styles.lock}
                      style={
                        lockTopic ? { display: 'inherit' } : { display: 'none' }
                      }
                      src={'/static/img/icon/icon_lock01.png'}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className={styles.row}>
              {attrList[4] && (
                <div
                  key={`attr-4`}
                  onClick={this.gotoAttr.bind(this, {
                    attr: attrList[4],
                    lockTopic
                  })}
                  className={styles.cell}
                >
                  <div className={styles.attr}>{attrList[4].attrName}</div>
                  <div
                    className={styles.bg}
                    style={{
                      backgroundImage:
                        'url("/static/img/icon/icon_' +
                        attrList[4].attrId +
                        '.png")'
                    }}
                  />
                  <div
                    className={styles.bottom}
                    style={{
                      background: '#fd8f37'
                    }}
                  >
                    <div>优化建议 ></div>
                    <img
                      className={styles.lock}
                      style={
                        lockTopic ? { display: 'inherit' } : { display: 'none' }
                      }
                      src={'/static/img/icon/icon_lock01.png'}
                    />
                  </div>
                </div>
              )}
              <div style={{ width: '20px' }} />
              {attrList[5] && (
                <div
                  key={`attr-5`}
                  onClick={this.gotoAttr.bind(this, {
                    attr: attrList[5],
                    lockTopic
                  })}
                  className={styles.cell}
                >
                  <div className={styles.attr}>{attrList[5].attrName}</div>
                  <div
                    className={styles.bg}
                    style={{
                      backgroundImage:
                        'url("/static/img/icon/icon_' +
                        attrList[5].attrId +
                        '.png")'
                    }}
                  />
                  <div
                    className={styles.bottom}
                    style={{
                      background: '#fd7d8f'
                    }}
                  >
                    <div>优化建议 ></div>
                    <img
                      className={styles.lock}
                      style={
                        lockTopic ? { display: 'inherit' } : { display: 'none' }
                      }
                      src={'/static/img/icon/icon_lock01.png'}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className={styles.row}>
              {attrList[6] && (
                <div
                  key={`attr-6`}
                  onClick={this.gotoAttr.bind(this, {
                    attr: attrList[6],
                    lockTopic
                  })}
                  className={styles.cell}
                >
                  <div className={styles.attr}>{attrList[6].attrName}</div>
                  <div
                    className={styles.bg}
                    style={{
                      backgroundImage:
                        'url("/static/img/icon/icon_' +
                        attrList[6].attrId +
                        '.png")'
                    }}
                  />
                  <div
                    className={styles.bottom}
                    style={{
                      background: '#afe568'
                    }}
                  >
                    <div>优化建议 ></div>
                    <img
                      className={styles.lock}
                      style={
                        lockTopic ? { display: 'inherit' } : { display: 'none' }
                      }
                      src={'/static/img/icon/icon_lock01.png'}
                    />
                  </div>
                </div>
              )}
              <div style={{ width: '20px' }} />
              {attrList[7] && (
                <div
                  key={`attr-7`}
                  onClick={this.gotoAttr.bind(this, {
                    attr: attrList[7],
                    lockTopic
                  })}
                  className={styles.cell}
                >
                  <div className={styles.attr}>{attrList[7].attrName}</div>
                  <div
                    className={styles.bg}
                    style={{
                      backgroundImage:
                        'url("/static/img/icon/icon_' +
                        attrList[7].attrId +
                        '.png")'
                    }}
                  />
                  <div
                    className={styles.bottom}
                    style={{
                      background: '#5fd8ef'
                    }}
                  >
                    <div>优化建议 ></div>
                    <img
                      className={styles.lock}
                      style={
                        lockTopic ? { display: 'inherit' } : { display: 'none' }
                      }
                      src={'/static/img/icon/icon_lock01.png'}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.sectionBottom}>
            <img
              className={styles['bottom-img']}
              src={`${getCookie('adpath')}`}
              onClick={this.handleAd}
            />
            <img
              className={styles['bottom-img']}
              src={'/static/img/result_pro.png'}
              onClick={this.handleTest.bind(this, { lock })}
            />
          </div>
          {/*<img className={styles.page} src='/static/img/page/result_01.png'/>*/}
          {/*<img onClick={this.handleTest} className={styles.page} src='/static/img/page/result_02.png'/>*/}
          {/*<img className={styles.page} src='/static/img/page/result_03.png'/>*/}
        </div>
        <div
          className={styles.mask}
          style={
            this.state.shareVisible ? { display: 'block' } : { display: 'none' }
          }
          onClick={() => {
            this.setState({ shareVisible: false });
          }}
        >
          <img
            style={{
              width: '320px',
              height: '320px',
              position: 'fixed',
              top: 0,
              right: 0,
              zIndex: 20
            }}
            src={'/static/img/sharemask.png'}
          />
        </div>
        {/* <Modal
          visible={this.state.posterVisible}
          transparent={true}
          maskClosable={false}
          platform={'android'}
          closable={true}
          onClose={() => {
            this.setState({ posterVisible: false });
          }}
        >
          <img style={{ width: '100%' }} src={`/static/img/poster/${attr}.jpg`} />
        </Modal> */}
        <Modal
          visible={this.state.testVisiable}
          transparent={true}
          //    maskClosable={true}
          //    platform={'android'}
          closable={true}
          onClose={() => {
            this.setState({ testVisiable: false });
          }}
        >
          <div>
            <div className={styles['modal-title-wrapper']}>
              <div className={styles['modal-title']}>请输入邀请码解锁报告</div>
              <div className={styles['modal-title']}>
                或支付
                <span className={styles.emphasize}>
                  ￥{(report.total_fee / 100).toFixed(2)}
                </span>
                查看
              </div>
            </div>
            <InputItem
              className={styles.item__name}
              placeholder="请输入邀请码"
              value={this.state.invitation}
              onChange={v => this.setState({ invitation: v })}
            />
            <div className={styles.inline}>
              {/* <Button
                onClick={() => {
                  this.setState({ testVisiable: false });
                }}
              >
                取消
              </Button> */}
              <Button
                type="primary"
                style={{ background: '#fca34a' }}
                onClick={this.handleModalTest}
              >
                确定
              </Button>
              <Button
                onClick={this.handlePay}
                type="primary"
                style={{ background: '#fca34a' }}
              >
                支付
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          visible={this.state.bak}
          transparent={true}
          closable={true}
          onClose={() => {
            this.setState({ bak: false });
          }}
        >
          <p>即将上线，敬请期待！</p>
        </Modal>
        {this.renderPoster(postId)}
      </>
    );
  }
}

export default PageWrapper(createForm()(Page));
