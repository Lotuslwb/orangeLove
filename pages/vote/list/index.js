import React from 'react'
import Link from 'next/link'
import {
    NavBar, List, InputItem, WhiteSpace, WingBlank, Button, Toast, Flex, Radio, Result, Icon,
    TextareaItem, Calendar
} from 'antd-mobile';
import {createForm} from 'rc-form';
import PageWrapper from '@components/PageWrapper';
import RedPacketType from '@constants/RedPacketType';
import agent from "@utils/agent";
import AppListView from '@components/AppListView/index';
import './index.less';
import ListStore from "@stores/ListStore";

const RadioItem = Radio.RadioItem;

class Page extends React.Component {

    constructor(props) {
        super(props);

        const {query} = this.props;
        this.listStore = new ListStore(agent.Vote.getList, {}, (item) => {
        });
    }

    componentDidMount() {
        this.listStore.requestData();
    }

    render() {
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    height: 2,
                }}
            />
        );
        const row = (rowData, sectionID, rowID) => {
            const {title, content} = rowData;
            return (
                <div key={rowID} style={{padding: '0 15px'}}>
                    <div>{title}</div>
                </div>
            );
        };
        const renderHeader = () => {
            return (
                <span></span>
            );
        };
        return (
            <>
            <AppListView store={this.listStore}
                         renderRow={row}
                         renderHeader={renderHeader}
                         renderSeparator={separator}
            />
            </>
        )
    }

}

export default PageWrapper(createForm()(Page));
