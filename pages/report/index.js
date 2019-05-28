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
import { Radar } from 'react-chartjs';

const RadioItem = Radio.RadioItem;

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
      let labels = [];
      const attrData = [];
      (data.radarData || []).forEach(attr => {
        labels.push(attr.attrName);
        attrData.push(attr.score);
      });
      const seriesData = {
        labels,
        datasets: [
          {
            label: 'My Second dataset',
            fillColor: 'rgba(234,135,68,0.2)',
            strokeColor: 'rgba(234,135,68,.8)',
            pointColor: 'rgba(234,135,68,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(151,187,205,1)',
            data: attrData
          }
        ]
      };
      this.setState({
        report: data || {},
        seriesData
      });
    } catch (e) {
      alert('该年龄段暂不支持报告分析');
    } finally {
    }
  }

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
        game3 = []
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
              {seriesData && (
                <Radar
                  data={seriesData}
                  width={300}
                  height={300}
                  options={{
                    legend: {
                      display: false
                    },
                    scale: {
                      display: true,
                      ticks: {
                        display: true,
                        beginAtZero: true,
                        maxTicksLimit: 100,
                        stepSize: 20
                      }
                    }
                  }}
                />
              )}
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
          <div className={styles.card}>
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
          </div>
        </div>
        <div className={styles['card-title']}>教育游戏</div>
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
        </Carousel>
      </div>
    );
  }
}

export default PageWrapper(createForm()(Page));