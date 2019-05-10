import Document, {Head, Main, NextScript} from 'next/document'
import store from 'store';

export default class extends Document {

    componentDidMount() {
        console.log('_document test');
    }

    render() {
        return (
            <html>
            <Head>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"/>
                <link rel='stylesheet' type='text/css' href='//unpkg.com/antd-mobile/dist/antd-mobile.min.css'/>
                {/* <link rel='stylesheet' href='/_next/static/css/styles.chunk.css'/> */}
            </Head>
            <body style={{margin: 0}}>
            <Main />
            <NextScript />
            <script src="http://res.wx.qq.com/open/js/jweixin-1.3.2.js"/>
            </body>
            </html>
        )
    }
}
