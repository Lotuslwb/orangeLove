import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Head from 'next/head';
import agent from '@utils/agent';
import Router from 'next/router'
import storage from '@utils/storage';
import {isWeixinBrowser} from '@utils/utils';

const PageWrapper = (ComposedComponent) => {
    class AppLayout extends Component {

        constructor(props) {
            super(props);
        }

        static async getInitialProps({res, query}) {
            return {
                query
            };
        }

        componentDidMount() {
            const {query} = this.props;
            const user = storage.UserInfo.get();
            const isWeixin = isWeixinBrowser();
            this.setState({
                isWeixin
            });
            if (!user) {
                if (isWeixin) {
                    if (!query.code) {
                        agent.Wechat.getAuthorizationUrl()
                            .then(data => {
                                console.log(data);
                                Router.replace(data);
                            })
                    } else {
                        agent.Wechat.login(query.code, query.fromId)
                            .then(data => {
                                storage.UserInfo.set(data);
                                agent.Wechat.getConfig().then(config => {
                                    debugger
                                    config.jsApiList = ['onMenuShareAppMessage'];
                                    wx.config(config);
                                    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
                                        wx.onMenuShareAppMessage({
                                            title: '橙爱天赋测评', // 分享标题
                                            desc: '测测你的孩子有哪些独一无二的天赋', // 分享描述
                                            link: 'http://house.t.gegosport.com?fromId=' + data.userId, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                            imgUrl: '', // 分享图标
                                            success: function () {
                                                // 设置成功
                                            }
                                        })
                                    });
                                })
                            });
                    }
                }
            } else {
                agent.Wechat.getConfig().then(config => {
                    config.jsApiList = ['onMenuShareAppMessage'];
                    wx.config(config);
                    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
                        wx.onMenuShareAppMessage({
                            title: '橙爱天赋测评', // 分享标题
                            desc: '测测你的孩子有哪些独一无二的天赋', // 分享描述
                            link: 'http://house.t.gegosport.com?fromId=' + user.userId, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: '', // 分享图标
                            success: function () {
                                // 设置成功
                            }
                        })
                    });
                })
            }
            // if (isWeixin) {
            //     agent.Wechat.getConfig()
            //         .then(data => {
            //             // data.debug = true;
            //             data.jsApiList = [
            //                 'chooseImage'
            //             ];
            //             wx.config(data);
            //             wx.checkJsApi({
            //                 jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            //                 success: function (res) {
            //                 }
            //             });
            //         });
            // }
        }

        render() {
            return (
                <div>
                    <Head>
                        <script src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
                    </Head>
                    <ComposedComponent {...this.props} />
                </div>
            );
        }
    }

    return AppLayout;
};

export default PageWrapper;
