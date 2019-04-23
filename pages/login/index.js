import {List, InputItem, WhiteSpace, WingBlank, Button} from 'antd-mobile';
import {createForm} from 'rc-form';
import PageWrapper from '@components/PageWrapper';
import './index.less'


class Page extends React.Component {
    componentDidMount() {
        // this.autoFocusInst.focus();
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
                login
            </div>
        );
    }
}

export default PageWrapper(createForm()(Page));
