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
  Modal
} from 'antd-mobile';
import { createForm } from 'rc-form';
import PageWrapper from '@components/PageWrapper';
import RedPacketType from '@constants/RedPacketType';
import agent from '@utils/agent';
import styles from './index.less';
import pageStore from './store';
import storage from '@utils/storage';
import Router from 'next/router';
import { Radar, Doughnut } from 'react-chartjs';

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
      invitation: ''
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
      if (report.shareCount < 1) {
        labels = emptyLabels;
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
        doughnutData
      });
    } catch (e) {
    } finally {
    }
  }

  showModal = () => {
    const { testVisiable } = this.state;

    this.setState({
      testVisiable: !testVisiable
    });
  };
  handleModalTest = async () => {
    const { attrId, pro, invitation } = this.state;
    // 需要调接口看邀请码是否通过
    const result = await agent.Baby.unlock({
      type: 'qcode',
      value: invitation && invitation.trim().toUpperCase()
    });
    console.log(result);
    debugger;
    if (result) {
      if (pro) {
        Router.push('/profession');
      } else {
        Router.push(`/report?attrId=${attrId}`);
      }
    }
  };

  handleTest = ({ attr, lock, pro = false }) => {
    console.log(attr);
    this.setState({
      attrId: attr ? attr.attrId : 0,
      pro: !!pro
    });
    if (!lock) {
      if (pro) {
        Router.push('/profession');
      } else {
        Router.push(`/report?attrId=${attr.attrId}`);
      }
      return;
    } else {
      this.showModal();
    }
  };

  handleOpenPoster = () => {
    this.setState({ posterVisible: true });
  };

  renderPoster = attr => {
    const { posterVisible } = this.state;
    return (
      <div style={posterVisible ? { display: 'block' } : { display: 'none' }}>
        <div className={styles.mask} />
        <div className={styles['md-wrapper']}>
          <div className={styles.md}>
            <div
              className={styles['md-close']}
              onClick={() => {
                this.setState({ posterVisible: false });
              }}
            >
              <img src="/static/img/close.png" alt="" />
            </div>
            <div className={styles['md-content']}>
              <img
                src={`/static/img/poster/${attr}.jpg`}
                className={styles.post}
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

  render() {
    const { report = {}, doughnutData, radarData } = this.state;
    const attrList = report.attrList || [];
    if (!attrList.length) return null;
    const attr = attrList[0].attrId;
    const lock = !!!report.unlock;
    const attrLen = attrList.length;
    let summary = `宝贝的优势智能是${attrList[0].attrName}，${
      attrList[1].attrName
    }，${attrList[2].attrName}；`;
    if (lock) {
      summary += `宝贝在**，**，**有所欠缺，需要进行引导`;
    } else {
      summary += `宝贝在${attrList[attrLen - 3].attrName}，${
        attrList[attrLen - 2].attrName
      }，${attrList[attrLen - 1].attrName}有所欠缺，需要进行引导`;
    }

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
        <div className={styles.main}>
          <div className={styles.sectionHead}>
            <div className={styles.doughnutWrapper}>
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
            </div>
            <div className={styles.sentences}>
              {(report.sentences || []).map(sentence => {
                return <div>{sentence}</div>;
              })}
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
                  width={300}
                  height={300}
                  options={{
                    legend: {
                      display: false
                    }
                  }}
                />
              )}
            </div>
            <div className={styles.summary}>
              <div className={styles.summaryLabel}>智能总评</div>
              <div className={styles.summaryContent}>{summary}</div>
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
              优势智能
            </div>
            <div className={styles.tips}>
              * 劣势智能如何增强请查看专业版报告
            </div>
            <div className={styles.row}>
              {attrList[0] && (
                <div
                  key={`attr-0`}
                  onClick={this.handleTest.bind(this, {
                    attr: attrList[0],
                    lock
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
                        lock ? { display: 'inherit' } : { display: 'none' }
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
                  onClick={this.handleTest.bind(this, {
                    attr: attrList[1],
                    lock
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
                        lock ? { display: 'inherit' } : { display: 'none' }
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
                  onClick={this.handleTest.bind(this, {
                    attr: attrList[2],
                    lock
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
                        lock ? { display: 'inherit' } : { display: 'none' }
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
                  onClick={this.handleTest.bind(this, {
                    attr: attrList[3],
                    lock
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
                        lock ? { display: 'inherit' } : { display: 'none' }
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
              style={{ width: '100%' }}
              src={'/static/img/result_work.png'}
              onClick={() => {
                this.setState({ bak: true });
              }}
            />
            <img
              style={{ width: '100%' }}
              src={'/static/img/result_pro.png'}
              onClick={this.handleTest.bind(this, { pro: true, lock })}
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
                或支付<span className={styles.emphasize}>￥199</span>查看
              </div>
            </div>
            <InputItem
              className={styles.item__name}
              placeholder="请输入邀请码"
              value={this.state.invitation}
              onChange={v => this.setState({ invitation: v })}
            />
            <div className={styles.inline}>
              <Button
                onClick={() => {
                  this.setState({ testVisiable: false });
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                style={{ background: '#fca34a' }}
                onClick={this.handleModalTest}
              >
                确定
              </Button>
              {/* <Button onClick={this.handleModalTest} type="primary" style={{background: '#fca34a'}}>支付</Button> */}
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
        {this.renderPoster(attr)}
      </>
    );
  }
}

export default PageWrapper(createForm()(Page));
