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
import classNames from 'classnames';
import PageWrapper from '@components/PageWrapper';
import RedPacketType from '@constants/RedPacketType';
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

    this.state = {
      reports: []
    };
  }

  async componentDidMount() {
    try {
      const total = 8;
      // let attrArry = [];
      let requests = [];
      for (let i = 1; i <= total; i++) {
        // attrArry.push(i);
        requests.push(agent.Report.getByAttr(i));
      }

      const data = await Promise.all(requests);
      this.setState({
        reports: data
      });
    } catch (e) {
      alert('该年龄段暂不支持报告分析');
    } finally {
    }
  }

  renderReport = () => {
    const { reports } = this.state;
    return reports.map(report => {
      const { attr = {}, result = [], raise = [], direction = [] } = report;
      return (
        <div className={styles.innerpage}>
          <div className={styles.sectionHead}>
            <div className={styles.title}>{attr.name}</div>
            <div className={styles.content}>{attr.blurb}</div>
          </div>
          <div className={styles.cardList}>
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
        </div>
      );
    });
  };

  renderPrefix = () => {
    return (
      <>
        <div className={styles['pre-title']}>前言</div>
        <p className={styles.para}>
          尊敬的家长和亲爱的小朋友，从翻阅这份报告之时起，我们开启了探索儿童天赋之门。我们将一起一步一步深入了解孩子独特的智能结构，找出孩子的优势智能，培育孩子的天赋。我们所有的努力，是尽力揭示出蕴藏在孩子身体里面的、平常不容易观察到的特质。而这些特质可能对孩子的培养具有重要的参考价值。
        </p>
        <h3 className={styles['p-title']}>天赋与优势智能</h3>
        <p className={styles.para}>
          天赋是指在某些事物或领域具备天生擅长的能力，比如你一开始做某件事就能够毫不费劲地比别人做得更好。天赋呈现出来的状态是：做自己擅长和热爱的事，并有卓越的品质。
        </p>
        <p className={styles.para}>
          美国哈佛大学霍华德加德纳教授认为，在正常条件下，只要有适当的外界刺激和个体本身的努力，每个个体都能发展和加强自己的任何一种智能。他们的潜能可以为他们创造出不同的成功机会。我们把这种潜能或强项的智能表现出来的独特能力理解为天赋。
        </p>
        <p className={styles.para}>
          霍华德加德纳教授被誉为多元智能理论之父，他在1983
          年参与美国哈佛大学“零点项目”过程中，提出了多元智能理论：加德纳把智能定义为“是在某种社会和文化环境的价值标准下，个体用以解决问题或生产及创造出某种产品所需要的能力”。每个人身上都有八种不同的智能：语言智能、音乐智能、空间智能、自然观察智能、逻辑数学智能、自我认知智能、人际认知智能、身体动觉智能。
        </p>
        <img className={styles['pro-img']} src="/static/img/pro/pro-2.png" />
        <span className={styles['pro-tips']}>
          多元智能理论的三个对人的重要发现：
        </span>
        <p className={classNames(styles.para, styles.bold)}>
          一、 智能的生物性，每个人与生俱来具有 8 到 9 种智能；
        </p>
        <p className={classNames(styles.para, styles.bold)}>
          二、 智能的个体差异性：世界上每个人的智能结构都是不一样的；
        </p>
        <p className={classNames(styles.para, styles.bold)}>
          三、
          智能发展的不确定性：在某个方面拥有很强的智能并不息味，在这个领域必然获得成功。
        </p>
        <p className={styles.para}>
          加德纳还认为：“智能是指一种处理信息的生理心里潜能。这种潜能在某种文化背景之下，会被激活以解决问题或是创造该文化所珍视的产品。”而“优势智能”就是人们在处事和遇到难题时习惯采用或是最擅长应用这种智能思考和解决困难与问题的能力。人们通常把优势智能称为天赋，“泛指在某些方面超过同类的形式”。
        </p>
        <p className={styles.para}>
          在婴幼儿阶段我们可将“优势智能”解释为：在婴幼儿自身发展过程及解决生活中问题时所应用的各项能力当中，超过其他能力的、更善于应用的智能。每个幼儿都有自己的优势智能，即使是两个幼儿都在相同智能上显示了强项，这两个幼儿的此项智能强项也有着内在区别。
        </p>
        <span className={styles['pro-tips']}>
          通过研究我们认为“优势留能”在婴幼儿身上体现出三个特点：
        </span>
        <p className={classNames(styles.para, styles.bold)}>
          第一：“优势智能”是持续发展的。在婴幼儿时期显现的优势智能伴随着成长不会停止在一个状态，随着解决问题和日常生活中不断应用，此项优势智能也能够逐渐发展，成为孩子独特的天赋。
        </p>
        <p className={classNames(styles.para, styles.bold)}>
          第二：“优势智能”是可变化的。在婴幼儿时期，有些暂未显现的智能不一定就始终是非优势智能，在成长过程中，其他暂时看上去非优势智能通过练习和应用，有可能在某一特定时期会逐渐显现，成为“优势智能”。
        </p>
        <p className={classNames(styles.para, styles.bold)}>
          第三：因“势”利导才能更好地“顺强补弱”，从优势智能入，往往能更好地帮助婴幼儿建立自信心，带动其他各项智能全面发展，为未来的学习成长找到最佳入口和方法。
        </p>
        <h3 className={styles['p-title']}>天赋与教育环境</h3>
        <p className={styles.para}>
          天赋既有先天生理因素，也有后天实践和培养教育因素，任何的天赋，都离不开教育环境的支持。朗朗因父亲发现他的音乐天赋并给予全力的呵护和支持，成为当代的钢琴家。如果贝多芬一出生就被送去了美术班，如果让毕加索去学跳舞，让舞蹈家杨丽萍学数学……这些听上去不可思议的假设，其实每天都发生在我们身边。一个孩子从小学习那么多的兴趣班，可很多孩子到了填志愿时都还不清晰自己的定位。我们不禁想起一句话“教育就是把人的内心引导出来，成为他自己的样子。”
        </p>
        <p className={styles.para}>
          我们需要去发现个体的优势智能，但如何给予孩子好的成长和教育环境，将决定这个人最终的成就。关于智能的性质，加德纳认为尽管在各种环境和教育条件下个体身上都存在着这八种智能，但不同环境和教育条件下个体的智能发展方向和程度有明显的差异性。尊重儿童的个别差异，每个儿童都有不同的能力，且以不同的方式展示出来。
        </p>
        <p className={styles.para}>
          如果一个人有天赋，而没有适合培养天赋的成长环境和教育环境，那么这个人的天赋将不会得到有效开发，最终表现平常。因此有好的先天遗传而没有适宜的后天教育，好的先天因素就不能发挥优势。在培养孩子成长的过程中，孩子的天赋是潜在的能力，是与生俱来的，但是这一天赋要在成长中逐步被开发、完善，因此环境和教育决定孩子天赋能否被完美挖掘。
        </p>
        <img className={styles['pro-img']} src="/static/img/pro/pro-3.png" />
        <h3 className={styles['p-title']}>天赋与幸福能力</h3>
        <p className={styles.para}>
          如果说成功是他人眼中的杰出表现，而幸福则是自己内心最深层次的满足感。天赋是打造幸福的关键。过去，很多的父母都在关注“孩子是否会输在起跑线上”，未来，我们是否要更注重，“如何让一个孩子获得终生幸福的能力？”
        </p>
        <p className={styles.para}>
          很多父母在培育孩子的过程中，或对孩子人生未来的期望中，都会说只要孩子健康、快乐就行。我们的孩子是一个有着复杂感受的人，因此，他会随着成长环境、心理都会有变化。我们不仅要让孩子快乐学习，更要让孩子有个长久的快乐，我们暂且称他为幸福能力吧。
        </p>
        <p className={styles.para}>
          有人说“幸福是因个人理想的实现或接近，而得到内心的满足感。”，那身为父母或老师要考虑三个问题，这个孩子的理想是什么，这是孩子擅长的优势么？给予什么样的环境可以让她或他实现？
        </p>
        <p className={classNames(styles.para, styles.bold)}>
          这也正是本报告的意义所在，帮助父母发现孩子的天赎，培育孩子的天斌，让孩子以自己的天赋获得幸福的能力！
        </p>
      </>
    );
  };

  renderPersonal = () => {
    return (
      <>
        <div className={styles['pre-title']}>个性化报告分析</div>
        <h3 className={styles['p-title']}>如何解读测评结果</h3>
        <p className={styles.para}>
          我们建议父母在阅读本报告后．是致力于思考如何有针对性地培养孩子，而不是给孩子贴标签，例如“这个孩子很聪明”、“那个孩子不聪明”。
        </p>
        <p className={styles.para}>
          美国哈佛大学著名教育心理学家霍华德加德纳教授
          (H.Gardner)有一句名言：“任何孩子都有其优势智能领域”。所以，我们并不想给任何一个孩子贴上“天才”或”笨蛋”的标签，我们只希望通过专业的生物信息学分析和评估，能够在一定程度上呈现孩子的一些基本的生物学属性并发现孩子的潜能，并建议教育工作者因材施教。在这种思想下，每个孩子都可以成才，在各自的优势领域里成为有用之才。
        </p>
        <p className={styles.para}>
          作为一本发现孩子天赋的报告，它是与教育培养工作相配合的。孩子的天赋潜能要通过有针对性的教育培训才能得到发展，从而将天赋潜能转化成可以利用的能力。因此，本报告可以提供给所有可能教育培训这个孩子的教育培训机构的教师做参考。
        </p>
        <p className={styles.para}>
          另外，深入的咨询可以大大帮助我们更好地了解孩子。阅读者对本报告有任何不解或疑问，应当与天斌启蒙中心的专业人员进行讨论，专业的人员会向您解释本报告的内涵，以及我们为什么会做出这样的判断。相信通过良好的沟通和专业的评估，我们一定能够为广大家长提供一份专业的、科学的、有参考价值的评估报告。
        </p>
        <p className={styles.para}>
          每个智能延伸到三个不同的重要维度，建议家长和培育者从这三个维度来培育该智能。
        </p>
        <img className={styles['pro-img']} src="/static/img/pro/pro-4.png" />
        <img className={styles['pro-img']} src="/static/img/pro/pro-5.png" />
        <img className={styles['pro-img']} src="/static/img/pro/pro-6.png" />
      </>
    );
  };

  renderSuffix = () => {
    return (
      <>
        <div className={styles['pre-title']}>
          结语&nbsp;&nbsp;&nbsp;&nbsp;天赋与梦想
        </div>
        <p className={styles.para}>
          本报告作为天赋成长计划的重要部分，是我们借鉴多元智能理论与社会学、心理学、脑科学及生命科学研究的最新成果。因势利导，探索个性化学习和成长，从而成就儿童。
        </p>
        <p className={styles.para}>
          我们今天的启蒙教育，对孩子的引领，关乎孩子们未来与成就。我们不仅要站在全球的视野去看孩子们的天赋启蒙教育，更要站在人性化的角度，理解人类的差异。如何借鉴科学的教育理念，应用“智能科学”和网络技术。在中国这个人口众多教育资源不充分的国家里，实现个性化教育，让因材施教的千年理想在当代成为现实，让每个孩子成为最好的自己。作为父母和教育者，我们如何呵护孩子的天赋，发现孩子的天赋，并培育孩子天赋，这是我们育人之核心。当家长及社会都更好地理解了天赋的含义，就不会总担心孩子是否会输在起跑线上，懂得天赋教育的精髓，首先是转念之间，你从育儿的焦虑中转换成一个快乐的妈妈，从拿着放大镜去找孩子身上的不足，变成拥有一双擅于发现的眼睛，能看见孩子的优点，懂得积极关注，成长的过程是一个孩子在不断寻找自己的天赋，父母在不断地给予环境的支持共建内外生态系统的过程。祝福孩子健康、快乐成长，天赋显现，梦想成真！
        </p>
      </>
    );
  };

  render() {
    return (
      <div className={styles.page}>
        <img className={styles['pro-img']} src="/static/img/pro/pro-1.jpg" />
        {this.renderPrefix()}
        {this.renderPersonal()}
        <div className={styles['pre-title']}>个性化培育建议</div>
        {this.renderReport()}
        {this.renderSuffix()}
      </div>
    );
  }
}

export default PageWrapper(createForm()(Page));
