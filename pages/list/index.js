import {inject, observer} from 'mobx-react'
import PageWrapper from '@components/PageWrapper_real';
import AppListView from '@components/AppListView/index';
import ListStore from '@stores/ListStore';
import agent from '@utils/agent';

@observer
class Page extends React.Component {

    constructor(props) {
        super(props);

        this.listStore = new ListStore(agent.Book.getList, {}, (item) => {
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
                    height: 8,
                    borderTop: '1px solid #ECECED',
                    borderBottom: '1px solid #ECECED',
                }}
            />
        );
        const row = (rowData, sectionID, rowID) => {
            return (
                <div key={rowID} style={{padding: '0 15px'}}>
                    <div
                        style={{
                            lineHeight: '50px',
                            color: '#888',
                            fontSize: 18,
                            borderBottom: '1px solid #F6F6F6',
                        }}
                    >{rowData.name}</div>
                </div>
            );
        };
        return (
            <div>
                <AppListView store={this.listStore}
                             renderRow={row}
                             renderSeparator={separator}
                />
            </div>
        );
    }
}

export default PageWrapper(Page);
