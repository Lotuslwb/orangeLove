import React from 'react';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import {
    NavBar, List, InputItem, WhiteSpace, WingBlank, Button, Toast, Flex, Radio, Result, Icon,
    TextareaItem, Calendar, Card, Modal
} from 'antd-mobile';
import { createForm } from 'rc-form';
import PageWrapper from '@components/PageWrapper';
import RedPacketType from '@constants/RedPacketType';
import agent from "@utils/agent";
import styles from './index.less';
import pageStore from './store';
import storage from '@utils/storage';
import Router from 'next/router'
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
            attrId: 0
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

    showModal = attrId => {
        const { testVisiable } = this.state;
        this.setState({
            testVisiable: !testVisiable,
            attrId
        })
    }
    handleModalTest = () => {
        const { attrId } = this.state;
        Router.push(`/report?attrId=${attrId}`);
    }

    handleTest = (attr) => {
        console.log(attr);
        this.showModal(attr.attrId);
        // Router.push(`/report?attrId=${attr.attrId}`);
    };

    handleOpenPoster = () => {
        this.setState({ posterVisible: true });
    };

    render() {
        const { report = {}, doughnutData, radarData } = this.state;
        const attrList = report.attrList || [];
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
                <div className={styles.sectionHead}>
                    <div className={styles.doughnutWrapper}>
                        <div className={styles.percent}>{report.percent || ''}</div>
                        {doughnutData && (
                            <Doughnut data={doughnutData}
                                width={100}
                                height={100}
                                options={{
                                    segmentShowStroke: false,
                                    percentageInnerCutout: 90,
                                    animateRotate: false,
                                    legendTemplate: 'test'
                                }} />
                        )}
                    </div>
                    <div className={styles.sentences}>
                        {(report.sentences || []).map(sentence => {
                            return (
                                <div>{sentence}</div>
                            );
                        })}
                    </div>
                    {/*<img src='/static/img/btn_poster.png' onClick={this.handleOpenPoster.bind(this)}*/}
                    {/*style={{marginTop: '20px', width: '280px', height: '64px'}}/>*/}
                </div>
                <div className={styles.sectionBody}>
                    <div className={styles.radarWrapper}>
                        {radarData && (
                            <Radar data={radarData}
                                width={300}
                                height={300}
                                options={{
                                    legend: {
                                        display: false
                                    }
                                }} />
                        )}
                    </div>
                    <div className={styles.summary}>
                        <div className={styles.summaryLabel}>智能总评</div>
                        <div className={styles.summaryContent}>{report.summary || ''}</div>
                        <img src='/static/img/btn_share.png' onClick={() => {
                            this.setState({ shareVisible: true })
                        }} style={{ marginTop: '20px', width: '165px', height: '24px' }} />
                    </div>
                </div>
                <div className={styles.sectionMid}>
                    <div style={{ fontSize: '20px', textAlign: 'center' }}>优势智能</div>
                    <div className={styles.tips}>* 劣势智能如何增强请查看专业版报告</div>
                    <div className={styles.row}>
                        {attrList[0] && (
                            <div key={`attr-0`}
                                onClick={this.handleTest.bind(this, attrList[0])}
                                className={styles.cell}>
                                <div className={styles.icon} style={{
                                    backgroundImage: 'url("/static/img/icon/icon_gold.png")'
                                }}></div>
                                <div className={styles.attr}>{attrList[0].attrName}</div>
                                <div className={styles.bg}
                                    style={{ backgroundImage: 'url("/static/img/icon/icon_' + attrList[0].attrId + '.png")' }}
                                ></div>
                                <div className={styles.bottom} style={{
                                    background: '#fd8f37'
                                }}>
                                    <div>优化建议 ></div>
                                    <img className={styles.lock} src={'/static/img/icon/icon_lock01.png'} />
                                </div>
                            </div>
                        )}
                        <div style={{ width: '20px' }}></div>
                        {attrList[1] && (
                            <div key={`attr-1`}
                                onClick={this.handleTest.bind(this, attrList[1])}
                                className={styles.cell}>
                                <div className={styles.icon} style={{
                                    backgroundImage: 'url("/static/img/icon/icon_silver.png")'
                                }}></div>
                                <div className={styles.attr}>{attrList[1].attrName}</div>
                                <div className={styles.bg}
                                    style={{ backgroundImage: 'url("/static/img/icon/icon_' + attrList[1].attrId + '.png")' }}
                                ></div>
                                <div className={styles.bottom} style={{
                                    background: '#fd7d8f'
                                }}>
                                    <div>优化建议 ></div>
                                    <img className={styles.lock} src={'/static/img/icon/icon_lock01.png'} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.row}>
                        {attrList[2] && (
                            <div key={`attr-2`}
                                onClick={this.handleTest.bind(this, attrList[2])}
                                className={styles.cell}>
                                <div className={styles.icon} style={{
                                    backgroundImage: 'url("/static/img/icon/icon_copper.png")'
                                }}></div>
                                <div className={styles.attr}>{attrList[2].attrName}</div>
                                <div className={styles.bg}
                                    style={{ backgroundImage: 'url("/static/img/icon/icon_' + attrList[2].attrId + '.png")' }}
                                ></div>
                                <div className={styles.bottom} style={{
                                    background: '#afe568'
                                }}>
                                    <div>优化建议 ></div>
                                    <img className={styles.lock} src={'/static/img/icon/icon_lock01.png'} />
                                </div>
                            </div>
                        )}
                        <div style={{ width: '20px' }}></div>
                        {attrList[3] && (
                            <div key={`attr-3`}
                                onClick={this.handleTest.bind(this, attrList[3])}
                                className={styles.cell}>
                                <div className={styles.attr}>{attrList[3].attrName}</div>
                                <div className={styles.bg}
                                    style={{ backgroundImage: 'url("/static/img/icon/icon_' + attrList[3].attrId + '.png")' }}
                                ></div>
                                <div className={styles.bottom} style={{
                                    background: '#5fd8ef'
                                }}>
                                    <div>优化建议 ></div>
                                    <img className={styles.lock} src={'/static/img/icon/icon_lock01.png'} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.sectionBottom}>
                    <img style={{ width: '100%' }} src={'/static/img/result_work.png'} onClick={() => { this.setState({ bak: true }) }} />
                    <img style={{ width: '100%' }} src={'/static/img/result_pro.png'} onClick={() => { this.setState({ bak: true }) }} />
                </div>
                {/*<img className={styles.page} src='/static/img/page/result_01.png'/>*/}
                {/*<img onClick={this.handleTest} className={styles.page} src='/static/img/page/result_02.png'/>*/}
                {/*<img className={styles.page} src='/static/img/page/result_03.png'/>*/}
                {this.state.shareVisible && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, .7)'
                    }}

                        onClick={() => {
                            this.setState({ shareVisible: false })
                        }}>
                        <img style={{ width: '320px', height: '320px', position: 'fixed', top: 0, right: 0 }}
                            src={'/static/img/sharemask.png'} />
                    </div>
                )}
                <Modal visible={this.state.posterVisible}
                    transparent={true}
                    maskClosable={true}
                    platform={'android'}
                    onClose={() => {
                        this.setState({ posterVisible: false })
                    }}
                >
                    <img style={{ width: '100%' }} src={'/static/img/poster01.png'} />
                </Modal>
                <Modal visible={this.state.testVisiable}
                    transparent={true}
                    //    maskClosable={true}
                    //    platform={'android'}
                    closable={true}
                    onClose={() => {
                        this.setState({ testVisiable: false })
                    }}
                >
                    <div>
                        <div className={styles['modal-title-wrapper']}>
                            <div className={styles['modal-title']}>请输入邀请码解锁报告</div>
                            <div className={styles['modal-title']}>或支付<span className={styles.emphasize}>￥1.99</span>查看</div>
                        </div>
                        <InputItem className={styles.item__name} placeholder="请输入邀请码"></InputItem>
                        <div className={styles.inline}>
                            <Button onClick={this.handleModalTest}>确定</Button>
                            <Button onClick={this.handleModalTest} type="primary" style={{background: '#fca34a'}}>支付</Button>
                        </div>
                    </div>
                </Modal>
                <Modal visible={this.state.bak}
                    transparent={true}
                    closable={true}
                    onClose={() => {
                        this.setState({ bak: false })
                    }}
                >
                    <p>即将上线，敬请期待！</p>
                </Modal>
            </>
        )
    }

}

export default PageWrapper(createForm()(Page));
