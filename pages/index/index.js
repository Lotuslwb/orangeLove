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
  ActivityIndicator
} from 'antd-mobile';
import { createForm } from 'rc-form';
import PageWrapper from '@components/PageWrapper';
import RedPacketType from '@constants/RedPacketType';
import styles from './index.less';
import pageStore from './store';
import storage from '@utils/storage';
import Router from 'next/router';
import agent from '@utils/agent';
import { getQueryVariable, setCookie } from '@utils/utils';

const RadioItem = Radio.RadioItem;

@observer
class Page extends React.Component {
  constructor(props) {
    super(props);

    const { query } = this.props;
    if (query.voteId) {
      this.voteId = query.voteId;
    }

    this.state = { loading: false, cover: '' };
  }

  async componentDidMount() {
    const id = getQueryVariable('groupid') || '1';
    setCookie('groupid', id);
    const data = await agent.System.getGroup(id);
    this.setState({
      cover: data.coverpicPath,
      host: window.location.protocol + '//' + window.location.host
    });
    // setCookie('cover', data.coverpicPath);
    setCookie('adpath', data.adpicPath);
    setCookie('adurl', data.adurl);
    setCookie('posterPath', data.posterQcodePath);
  }

  handleTest = async () => {
    try {
      Router.push('/baby');
      // this.setState({
      //     loading: true
      // });
      // const data = await agent.Baby.get();
      // Router.push('/question');
    } catch (e) {
      Router.push('/baby');
    } finally {
      this.setState({
        loading: false
      });
    }
  };

  render() {
    const { loading, cover, host } = this.state;

    return (
      <>
        {/*<Button type="primary" onClick={this.handleTest}>点击测试</Button>*/}
        {loading && <ActivityIndicator toast text="正在加载" />}
        <div className={styles.wp} onClick={this.handleTest}>
          <img
            className={styles.page}
            src={host ? `${host}:8360${cover}` : '/static/img/page/page1.jpg'}
          />
          <img className={styles.start} src="/static/img/page/btn_start.png" />
        </div>
      </>
    );
  }
}

export default PageWrapper(createForm()(Page));
