import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Head from 'next/head';
import agent from '@utils/agent';
import Router from 'next/router';
import storage from '@utils/storage';
import { isWeixinBrowser, getCookie } from '@utils/utils';

const PageWrapper = ComposedComponent => {
  class AppLayout extends Component {
    constructor(props) {
      super(props);
    }

    static async getInitialProps({ res, query }) {
      return {
        query
      };
    }

    componentDidMount() {
      const { query } = this.props;
      const user = storage.UserInfo.get();
      const isWeixin = isWeixinBrowser();
      this.setState({
        isWeixin
      });
      const groupid = getCookie('groupid') || '1';
      if (!user) {
        if (isWeixin) {
          if (!query.code) {
            agent.Wechat.getAuthorizationUrl().then(data => {
              console.log(data);
              Router.replace(data);
            });
          } else {
            agent.Wechat.login(query.code, query.fromId).then(data => {
              storage.UserInfo.set(data);
              agent.Wechat.getConfig().then(config => {
                config.jsApiList = ['onMenuShareAppMessage', 'chooseWXPay'];
                // config.debug = true;
                wx.config(config);
                wx.ready(function() {
                  //需在用户可能点击分享按钮前就先调用
                  wx.onMenuShareAppMessage({
                    title: '天赋Discovery测评系统', // 分享标题
                    desc: '每一个孩子都聪明，只是聪明的方面千差万别', // 分享描述
                    link: 'http://house.t.gegosport.com?groupid=' + groupid, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: '/static/img/share_logo.png', // 分享图标
                    // success: function () {
                    //   console.log('分享成功')
                    //   agent.Baby.unlock({
                    //     type: 'addShare'
                    //   })
                    // }
                    success: async function() {
                      console.log('分享成功');
                      await agent.Baby.unlock({
                        type: 'addShare'
                      });
                      window.location.reload();
                    }
                  });
                });
              });
            });
          }
        }
      } else {
        agent.Wechat.getConfig().then(config => {
          config.jsApiList = ['onMenuShareAppMessage', 'chooseWXPay'];
          // config.debug = true;
          wx.config(config);
          wx.ready(function() {
            //需在用户可能点击分享按钮前就先调用
            wx.onMenuShareAppMessage({
              title: '天赋Discovery测评系统', // 分享标题
              desc: '每一个孩子都聪明，只是聪明的方面千差万别', // 分享描述
              link: 'http://house.t.gegosport.com?groupid=' + groupid, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: '/static/img/share_logo.png', // 分享图标
              // success: function () {
              //   console.log('分享成功')
              //   agent.Baby.unlock({
              //     type: 'addShare'
              //   })
              // }
              success: async function() {
                console.log('分享成功');
                await agent.Baby.unlock({
                  type: 'addShare'
                });
                window.location.reload();
              }
            });
          });
        });
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
          {' '}
          {/* <Head>
                                  <script src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
                              </Head> */}{' '}
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
            />
            <link
              rel="stylesheet"
              type="text/css"
              href="//unpkg.com/antd-mobile/dist/antd-mobile.min.css"
            />
            <script src="http://res.wx.qq.com/open/js/jweixin-1.3.2.js" />
          </Head>{' '}
          <ComposedComponent {...this.props} />{' '}
        </div>
      );
    }
  }

  return AppLayout;
};

export default PageWrapper;
