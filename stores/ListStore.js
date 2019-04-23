import {observable, action, computed} from 'mobx';
import {ListView} from 'antd-mobile';

const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

export default class ListStore {

    @observable isLoading = false;
    @observable isRefreshing = false;
    @observable noMore = false;
    @observable pageList = [];
    @observable pageMap = {};
    @observable pagination = {};
    @observable dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
    });
    ps = 10;

    constructor(requestMethod, initParams, processItem, index) {
        this.requestMethod = requestMethod;
        if (initParams) {
            this.initParams = initParams;
        } else {
            this.initParams = {};
        }
        this.pathParams = [];
        this.ps = 10;
        if (this.initParams.ps) {
            this.ps = this.initParams.ps;
        }
        this.processItem = processItem;
        this.index = index || '';

        this.pagination = {
            nt: null,
            pt: null,
            totalCount: 0,
        };
        this.itemList = [];
        this.itemMap = {};
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
    }

    setPathParams(params) {
        if (params && params.length) {
            this.pathParams = params;
        }
    }

    requestData(params) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.isRefreshing = true;
        const {itemMap} = this;
        params = this._beforeRefreshData({
            ...this.initParams,
            ...params,
        });
        return this.requestMethod.apply(this, [...this.pathParams, params])
            .then(data => {
                this._afterLoadMoreData(data);
                data.list.forEach((item) => {
                    this.processItem && this.processItem(item);
                    itemMap[item.id] = item;
                });
                this.itemList = data.list;
                this.itemMap = itemMap;
                this.dataSource = this.dataSource.cloneWithRows(this.itemList.slice());
            })
            .catch(() => {
            })
            .finally(() => {
                this.isLoading = false;
                this.isRefreshing = false;
            });
    }

    loadMoreData(params) {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        const {itemMap} = this;
        params = this._beforeLoadMoreData({
            ...this.initParams,
            ...params,
        });
        if (!params) {
            return;
        }
        return this.requestMethod.apply(this, [...this.pathParams, params])
            .then(data => {
                this._afterLoadMoreData(data);
                data.list.forEach((item) => {
                    this.processItem && this.processItem(item);
                    itemMap[item.id] = item;
                });
                this.itemList = this.itemList.concat(data.list);
                this.itemMap = itemMap;
                this.dataSource = this.dataSource.cloneWithRows(this.itemList.slice());
            })
            .catch(() => {
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    _beforeRefreshData(params) {
        params || (params = {});
        params.ps = this.ps;
        return params;
    }

    _beforeLoadMoreData(params) {
        if (this.noMore) {
            return false;
        }
        params || (params = {});
        params.ps = this.ps;
        if (this.pagination.nt) {
            params.nt = this.pagination.nt;
        }
        if (this.pagination.pn) {
            params.pn = this.pagination.pn;
        }
        const pagination = {
            ...this.pagination,
        };
        this.pagination = pagination;
        return params;
    };

    _afterLoadMoreData(data) {
        if (data.list && data.list.length < this.ps) {
            this.noMore = true;
        }
        if (data.page_list && data.page_list.length < this.ps) {
            this.noMore = true;
        }
        const pagination = {};
        if (data.count) {
            pagination.totalCount = data.count;
        }
        if (data.nt) {
            pagination.nt = data.nt;
        }
        if (data.pageNum !== null && data.pageNum !== undefined) {
            pagination.pn = Number(data.pageNum) + 1;
        }
        this.pagination = pagination;
    };

};