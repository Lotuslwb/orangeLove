import React, {Component} from 'react';
import Head from 'next/head';
import agent from '@utils/agent';
import Router from 'next/router'
import storage from '@utils/storage';
import {isWeixinBrowser} from '@utils/utils';

const PageWrapper = (ComposedComponent) => {
    class AppLayout extends Component {

        constructor(props) {
            super(props);

            this.state = {
                telegramLogin: false,
            };
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
                        agent.Wechat.login(query.code)
                            .then(data => {
                                storage.UserInfo.set(data);
                            });
                    }
                } else {
                    // this.setState({
                    //     telegramLogin: true,
                    // });
                }
            } else {

            }
            window.onTelegramAuth = (user) => {
                agent.Telegram.login(user)
                    .then(user => {
                        storage.UserInfo.set(user);
                        // this.setState({
                        //     telegramLogin: false,
                        // });
                    });
            };
            if (isWeixin) {
                agent.Wechat.getConfig()
                    .then(data => {
                        // data.debug = true;
                        data.jsApiList = [
                            'chooseImage'
                        ];
                        wx.config(data);
                        wx.checkJsApi({
                            jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                            success: function (res) {
                            }
                        });
                    });
            }
        }

        render() {
            return (
                <div>
                    {!this.state.telegramLogin && <style jsx global>{`
      #telegram-login-GegoCnBot {
      display: none;
      }
    `}</style>}
                    {this.state.telegramLogin && <style jsx global>{`
      #telegram-login-GegoCnBot {
      position: fixed;
      z-index: 200;
      top: 50%;
      left: 50%;
      margin-top: -20px;
      margin-left: -120px;
      }
      .u-mask {
      position: fixed;
      z-index: 100;
      top: 0; bottom: 0; left: 0; right: 0;
      background: rgba(0, 0, 0, .5);
      }
    `}</style>}
                    {this.state.telegramLogin && (
                        <div class="u-mask"/>
                    )}
                    <Head>
                    </Head>
                    <ComposedComponent {...this.props} />
                </div>
            );
        }
    }

    return AppLayout;
};

export default PageWrapper;