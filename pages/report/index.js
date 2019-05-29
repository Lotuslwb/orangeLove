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
  Carousel
} from 'antd-mobile';
import { createForm } from 'rc-form';
import PageWrapper from '@components/PageWrapper';
import RedPacketType from '@constants/RedPacketType';
import agent from '@utils/agent';
import styles from './index.less';
import pageStore from './store';
import storage from '@utils/storage';
import Router from 'next/router';
// import { Radar } from 'react-chartjs';

const RadioItem = Radio.RadioItem;
const F2 = require('@antv/f2');

@observer
class Page extends React.Component {
  constructor(props) {
    super(props);

    const { query } = this.props;
    if (query.attrId) {
      this.attrId = query.attrId;
    }
    // this.attrId = 1;

    this.state = {
      report: {},
      seriesData: null
    };
  }

  async componentDidMount() {
    try {
      const data = await agent.Report.getByAttr(this.attrId);
      //   let labels = [];
      //   const attrData = [];
      //   (data.radarData || []).forEach(attr => {
      //     labels.push(attr.attrName);
      //     attrData.push(attr.score);
      //   });
      //   const seriesData = {
      //     labels,
      //     datasets: [
      //       {
      //         label: 'test',
      //         // fill: true,
      //         // backgroundColor: 'rgba(255, 99, 132, 0.2)',
      //         // borderColor: 'rgb(255, 99, 132)',
      //         // pointBackgroundColor: 'rgb(255, 99, 132)',
      //         // pointBorderColor: '#fff',
      //         // pointHoverBackgroundColor: '#fff',
      //         // pointHoverBorderColor: 'rgb(255, 99, 132)',
      //         fillColor: 'rgba(234,135,68,0.2)',
      //         strokeColor: 'rgba(234,135,68,.8)',
      //         pointColor: 'rgba(234,135,68,1)',
      //         pointStrokeColor: '#fff',
      //         pointHighlightFill: '#fff',
      //         pointHighlightStroke: 'rgba(151,187,205,1)',
      //         data: attrData
      //       }
      //     ]
      //   };
      this.setState({
        report: data || {}
      });
      this.renderRadar({ data: data.radarData, id: 'myChart' });
    } catch (e) {
      alert('该年龄段暂不支持报告分析');
    } finally {
    }
  }

  renderRadar = ({ data, id }) => {
    const chart = new F2.Chart({
      id,
      pixelRatio: window.devicePixelRatio, // 指定分辨率
      padding: 20
    });
    chart.coord('polar');
    chart.source(data, {
      score: {
        min: 0,
        max: 100
        //   nice: false,
        //   tickCount: 2
      }
    });
    chart.axis('score', {
      grid: {
        lineDash: null
      }
    });
    chart.axis('attrName', {
      grid: {
        lineDash: null
      }
    });
    chart.tooltip(false);
    // chart.tooltip({
    //     showTitle: true,
    //     showItemMarker: false,
    // });
    chart
      .line()
      .position('attrName*score')
      .color('rgba(234,135,68,0.2)')
      .style({
        fill: 'rgba(234,135,68,0.2)'
      });
    chart
      .point()
      .position('attrName*score')
      .color('rgba(234,135,68,1)')
      .style({
        stroke: '#fff',
        lineWidth: 1
      });
    chart.render();
  };

  getStar = star => {
    let imgs = [];
    for (let i = 0; i < star; i++) {
      imgs.push(
        <img src="/static/img/star-active.png" className={styles.star} />
      );
    }
    for (let i = star; i < 5; i++) {
      imgs.push(
        <img src="/static/img/star-inactive.png" className={styles.star} />
      );
    }
    return imgs;
  };

  render() {
    const {
      seriesData,
      report: {
        attr = {},
        result = [],
        raise = [],
        direction = [],
        game1 = [],
        game2 = [],
        game3 = [],
        star
      } = {}
    } = this.state;
    const games = [game1, game2];

    return (
      <div className={styles.page}>
        <div className={styles.sectionHead}>
          <div className={styles.title}>{attr.name}</div>
          <div className={styles.content}>{attr.blurb}</div>
        </div>
        <div className={styles.cardList}>
          <div className={styles.card}>
            <div className={styles.title}>智能分析</div>
            <div className={styles.radarWrapper}>
              <canvas id="myChart" width="300" height="300" />
              <div className={styles.rate}>
                {this.getStar(star)}
              </div>
              {/* {seriesData && (
                <Radar
                  data={testData}
                  width={300}
                  height={300}
                  options={testOptions}
                />
              )} */}
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.title}>结果分析</div>
            <div className={styles.content}>
              {result.map(item => {
                return <div>{item}</div>;
              })}
            </div>
          </div>
          {/* <div className={styles.card}>
            <div className={styles.title}>养育建议</div>
            <div className={styles.content}>
              {raise.map(item => {
                return <div>{item}</div>;
              })}
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.title}>努力方向</div>
            <div className={styles.content}>
              {direction.map(item => {
                return <div>{item}</div>;
              })}
            </div>
          </div> */}
        </div>
        {/* <div className={styles['card-title']}>教育游戏</div>
        <Carousel
          className={styles.carousel}
          cellSpacing={10}
          slideWidth={0.7}
          dots={false}
          infinite
          frameOverflow="auto"
        >
          {games.map((game, index) => (
            <div className={styles.carouselCard}>
              <div className={styles.title}>{game[0]}</div>
              <div className={styles.content}>{game[1]}</div>
            </div>
          ))}
        </Carousel> */}
      </div>
    );
  }
}

export default PageWrapper(createForm()(Page));
