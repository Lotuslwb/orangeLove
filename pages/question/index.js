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
  DatePickerView,
  DatePicker,
  Modal,
  ActivityIndicator
} from 'antd-mobile';
import { createForm } from 'rc-form';
import classNames from 'classnames';
import PageWrapper from '@components/PageWrapper';
import agent from '@utils/agent';
import styles from './index.less';
import pageStore from './store';
import storage from '@utils/storage';
import Router from 'next/router';

const RadioItem = Radio.RadioItem;

@observer
class Page extends React.Component {
  constructor(props) {
    super(props);

    const { query } = this.props;
    let questionIndex = 0;
    if (query.qidx) {
      questionIndex = Number(query.qidx);
    }

    this.state = {
      loading: false,
      birthday: null,
      name: '',
      questionIndex: questionIndex,
      answer: null,
      questionList: [],
      answerMap: {}
    };
  }

  async componentDidMount() {
    try {
      const data = await agent.Question.getList();
      this.setState({
        questionList: data
      });
    } catch (e) {
    } finally {
    }
  }

  onChange = value => {
    console.log(value);
    this.setState({
      value
    });
  };

  handleSubmit = () => {
    console.log(this.state);
  };

  handlePrev = () => {
    const { questionIndex } = this.state;
    if (questionIndex <= 0) {
      return;
    }
    this.setState({
      answer: null,
      questionIndex: questionIndex - 1
    });
    // Router.replace(`/question?qidx=${this.questionIndex - 1}`);
  };

  test = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('in test')
        resolve(1)
      }, 800);
    })
  }

  handleNext = async () => {
    try {
      const { questionIndex, answerMap, questionList } = this.state;
      if (questionIndex >= questionList.length - 1) {
        const answerList = [];
        for (let [questionId, option] of Object.entries(answerMap)) {
          answerList.push({
            questionId,
            ...option
          });
        }
        this.setState({
          loading: true
        });
        // await this.test()
        await agent.Question.answerList({
          answerList
        });
        Router.push('/summary/1');
      } else {
        let currentQ = Object.entries(answerMap)[questionIndex];
        // 如果这一题没有答案，则不能跳转；有答案才能跳转
        if (currentQ) {
          this.setState({
            questionIndex: questionIndex + 1
          });
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      // this.setState({
      //   loading: false
      // });
    }
    // console.log(this.questionIndex + 1);
    // Router.push(`/question?qidx=${this.questionIndex + 1}`);
  };

  handleChoose = async (question, choice) => {
    const { answerMap } = this.state;
    answerMap[question.id] = {
      attr_id: question.attr_id,
      attr_type_id: question.attr_type_id,
      option: choice
    };
    this.setState({
      answerMap
    });
    setTimeout(async () => {
      await this.handleNext();
    }, 100);
    // const data = await agent.Question.answer(question.id, choice);
    // try {
    // } catch (e) {
    //     console.log(e);
    // } finally {
    //
    // }
  };

  render() {
    const { loading, questionIndex, answerMap, questionList = [] } = this.state;
    if (!questionList.length) return null;
    const question = questionList[questionIndex] || {
      id: 0,
      name: ''
    };
    const selected = answerMap[question.id] && answerMap[question.id].option;
    const proActive = ((questionIndex + 1) / questionList.length) * 100;
    return (
      <div className={styles.page}>
        {' '}
        {loading && <ActivityIndicator toast text="正在加载" />}{' '}
        <div className={styles.header}>
          <div className={styles['progress-num']}>
            <div className={styles.number}> {questionIndex + 1} </div>{' '}
            <div className={styles.total}> /{questionList.length}</div>
          </div>{' '}
          <div className={styles.category}> {question.attrName} </div>{' '}
        </div>{' '}
        <div className={styles['progress-bar']}>
          <div
            className={styles['progress-active']}
            style={{
              width: proActive + '%'
            }}
          />{' '}
        </div>{' '}
        {/* <div className={styles.number}> {questionIndex + 1} / {questionList.length}</div> */}{' '}
        <div
          className={styles.card}
          style={
            loading ? { pointerEvents: 'none' } : { pointerEvents: 'auto' }
          }
        >
          <div className={styles.card__body}>
            <div className={styles.question}> {question.name} </div>{' '}
            <div
              onClick={this.handleChoose.bind(this, question, 'A')}
              className={
                'A' === selected ? styles.answer__chosen : styles.answer
              }
            >
              完全能做到{' '}
            </div>{' '}
            <div
              onClick={this.handleChoose.bind(this, question, 'B')}
              className={
                'B' === selected ? styles.answer__chosen : styles.answer
              }
            >
              有时能做到， 有时不能做到{' '}
            </div>{' '}
            <div
              onClick={this.handleChoose.bind(this, question, 'C')}
              className={
                'C' === selected ? styles.answer__chosen : styles.answer
              }
            >
              完全做不到{' '}
            </div>{' '}
            <div
              onClick={this.handleChoose.bind(this, question, 'D')}
              className={
                'D' === selected ? styles.answer__chosen : styles.answer
              }
            >
              不清楚{' '}
            </div>{' '}
          </div>{' '}
          {/*<div className={styles.card__footer}>*/} {/*</div>*/}{' '}
        </div>{' '}
        <div className={styles.step}>
          <div className={styles['action-wp']} onClick={this.handlePrev}>
            <img
              src="/static/img/prev.png"
              className={classNames(styles.icon, styles.prev)}
            />{' '}
            <div className={styles.text}>上一题 </div>{' '}
          </div>{' '}
          <div className={styles['action-wp']} onClick={this.handleNext}>
            <div
              className={styles.text}
              style={
                loading ? { pointerEvents: 'none' } : { pointerEvents: 'auto' }
              }
            >
              下一题{' '}
            </div>{' '}
            <img
              src="/static/img/prev.png"
              className={classNames(styles.icon, styles.next)}
            />{' '}
          </div>{' '}
        </div>{' '}
      </div>
    );
  }
}

export default PageWrapper(createForm()(Page));
