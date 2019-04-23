import React from 'react';
import {inject, observer} from 'mobx-react';
import Link from 'next/link';
import {
    NavBar, List, InputItem, WhiteSpace, WingBlank, Button, Toast, Flex, Radio, Result, Icon,
    TextareaItem, Calendar, Card
} from 'antd-mobile';
import {createForm} from 'rc-form';
import PageWrapper from '@components/PageWrapper';
import RedPacketType from '@constants/RedPacketType';
import agent from "@utils/agent";
import styles from './index.less';
import pageStore from './store';
import storage from '@utils/storage';
import Router from 'next/router'

const RadioItem = Radio.RadioItem;

@observer
class Page extends React.Component {

    constructor(props) {
        super(props);

        const {query} = this.props;
        if (query.attrId) {
            this.attrId = query.attrId;
        }

        this.state = {
            report: {}
        };
    }

    async componentDidMount() {
        try {
            const data = await agent.Report.getByAttr(this.attrId);

        } catch (e) {

        } finally {

        }
    }

    handleTest = () => {
        Router.push('/baby');
    };

    render() {
        const {report} = this.state;
        return (
            <>
                {/*<Button type="primary" onClick={this.handleTest}>点击测试</Button>*/}
                <img className={styles.page} src={`/static/img/page/${img}.png`} />
            </>
        )
    }

}

export default PageWrapper(createForm()(Page));
