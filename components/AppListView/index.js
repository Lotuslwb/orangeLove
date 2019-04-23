import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {ListView, PullToRefresh} from 'antd-mobile';

@observer
export default class AppListView extends React.Component {

    constructor(props) {
        super(props);
        this.listStore = props.store;
        this.state = {};
    }

    componentDidMount() {
        const height = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.listView).parentNode.offsetTop;
        this.setState({
            height,
        });
    }

    render() {
        const {renderRow, renderSeparator, renderHeader, renderFooter} = this.props;
        const style = {
            height: this.state.height,
            overflow: 'auto',
        };
        const props = {};
        if (renderHeader) {
            props.renderHeader = renderHeader;
        }
        return (
            <ListView
                ref={el => this.listView = el}
                dataSource={this.listStore.dataSource}
                {...props}
                renderFooter={() => (<div style={{textAlign: 'center'}}>
                    {this.listStore.noMore ? '已加载全部' : (this.listStore.isLoading ? 'Loading...' : 'Loaded')}
                </div>)}
                renderRow={renderRow}
                renderSeparator={renderSeparator}
                // style={style}
                pageSize={this.listStore.ps}
                onScroll={() => {
                    console.log('scroll');
                }}
                useBodyScroll
                scrollRenderAheadDistance={500}
                // pullToRefresh={<PullToRefresh
                //    refreshing={this.listStore.isRefreshing}
                //    onRefresh={() => this.listStore.requestData()}
                // />}
                onEndReached={() => this.listStore.loadMoreData()}
                onEndReachedThreshold={10}
            />
        );
    }


}