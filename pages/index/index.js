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
import { getQueryVariable } from '@utils/utils';

const RadioItem = Radio.RadioItem;

@observer
class Page extends React.Component {
  constructor(props) {
    super(props);

    const { query } = this.props;
    if (query.voteId) {
      this.voteId = query.voteId;
    }

    this.state = { loading: false };
  }

  async componentDidMount() {
    const id = getQueryVariable('groupid');
    await agent.System.getGroup(id || '1');
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
    const { loading } = this.state;
    return (
      <>
        {/*<Button type="primary" onClick={this.handleTest}>点击测试</Button>*/}
        {loading && <ActivityIndicator toast text="正在加载" />}
        <img
          onClick={this.handleTest}
          className={styles.page}
          src="/static/img/page/page1.jpg"
        />
      </>
    );
  }
}

export default PageWrapper(createForm()(Page));
