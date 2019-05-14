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
import Question from '../../constants/questions';

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
        questionList: data.list
      });
    } catch (e) {
    } finally {
    }
  }

  onChange = value => {
    console.log(value);
    this.setState({ value });
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

  handleNext = async () => {
    try {
      const { questionIndex, answerMap } = this.state;
      if (questionIndex >= Question.count() - 1) {
        const answerList = [];
        for (let [questionId, option] of Object.entries(answerMap)) {
          answerList.push({
            questionId,
            option
          });
        }
        this.setState({
          loading: true
        });
        const data = await agent.Question.answerList({
          answerList
        });
        const userInfo = storage.UserInfo.get();
        Router.push('/summary?fromId=' + userInfo.userId);
      } else {
        this.setState({
          questionIndex: questionIndex + 1
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({
        loading: false
      });
    }
    // console.log(this.questionIndex + 1);
    // Router.push(`/question?qidx=${this.questionIndex + 1}`);
  };

  handleChoose = async (question, choice) => {
    const { questionIndex, answerMap } = this.state;
    answerMap[question.id] = choice;
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
    const question = questionList[questionIndex] || { id: 0, name: '' };
    const proActive = ((questionIndex + 1) / questionList.length) * 100;
    return (
      <div className={styles.page}>
        {loading && <ActivityIndicator toast text="正在加载" />}
        <div className={styles.header}>
          <div className={styles['progress-num']}>
            <div className={styles.number}> {questionIndex + 1}</div>
            <div className={styles.total}>/{questionList.length}</div>
          </div>
          <div className={styles.category}>身体动觉智能</div>
        </div>
        <div className={styles['progress-bar']}>
          <div
            className={styles['progress-active']}
            style={{ width: proActive + '%' }}
          />
        </div>
        {/* <div className={styles.number}> {questionIndex + 1} / {questionList.length}</div> */}
        <div className={styles.card}>
          <div className={styles.card__body}>
            <div className={styles.question}>{question.name}</div>
            <div
              onClick={this.handleChoose.bind(this, question, 'A')}
              className={
                'A' === answerMap[question.id]
                  ? styles.answer__chosen
                  : styles.answer
              }
            >
              完全能做到
            </div>
            <div
              onClick={this.handleChoose.bind(this, question, 'B')}
              className={
                'B' === answerMap[question.id]
                  ? styles.answer__chosen
                  : styles.answer
              }
            >
              有时能做到，有时不能做到
            </div>
            <div
              onClick={this.handleChoose.bind(this, question, 'C')}
              className={
                'C' === answerMap[question.id]
                  ? styles.answer__chosen
                  : styles.answer
              }
            >
              完全做不到
            </div>
            <div
              onClick={this.handleChoose.bind(this, question, 'D')}
              className={
                'D' === answerMap[question.id]
                  ? styles.answer__chosen
                  : styles.answer
              }
            >
              不清楚
            </div>
          </div>
          {/*<div className={styles.card__footer}>*/}
          {/*</div>*/}
        </div>
        <div className={styles.step}>
          <div className={styles['action-wp']} onClick={this.handlePrev} >
            <img
              src="/static/img/prev.png"
              className={classNames(styles.icon, styles.prev)}
            />
            <div className={styles.text}>
              上一题
            </div>
          </div>
          <div className={styles['action-wp']} onClick={this.handleNext} >
            <div className={styles.text}>
              下一题
            </div>
            <img
              src="/static/img/prev.png"
              className={classNames(styles.icon, styles.next)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PageWrapper(createForm()(Page));
