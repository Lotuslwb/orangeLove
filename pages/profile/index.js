import {List, InputItem, WhiteSpace, WingBlank, Button} from 'antd-mobile';
import {createForm} from 'rc-form';
import PageWrapper from '@components/PageWrapper_real';
import './index.less';
import Router from 'next/router';

class Page extends React.Component {
    componentDidMount() {
        // this.autoFocusInst.focus();
        Router.replace('/login');
    }

    handleClick = () => {
        this.inputRef.focus();
    };

    handleSubmit = () => {
        const {form} = this.props;

        form.validateFields((err, fieldsValue) => {
            console.log(err);
            console.log(fieldsValue);
            if (err) {
                return;
            }
        });
    };


    render() {
        const {getFieldProps} = this.props.form;
        return (
            <div className="example">
                <List renderHeader={() => '完善资料'}>
                    <InputItem
                        {...getFieldProps('name')}
                        clear
                        placeholder=""
                        ref={el => this.inputRef = el}
                    >姓名</InputItem>
                </List>
                <WingBlank>
                    <WhiteSpace/>
                    <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                </WingBlank>
            </div>
        );
    }
}

export default PageWrapper(createForm()(Page));
