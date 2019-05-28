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
import { Radar } from 'react-chartjs';

const RadioItem = Radio.RadioItem;

@observer
class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reports: [],
      name: '',
      report: {}
    };
  }

  async componentDidMount() {
    try {
      const total = 8;
      let requests = [];
      requests.push(agent.Baby.get());
      requests.push(agent.Baby.getReport());
      for (let i = 1; i <= total; i++) {
        requests.push(agent.Report.getByAttr(i));
      }

      const data = await Promise.all(requests);
      const user = data[0];
      const report = data[1];
      const attrs = data.slice(2);
      let labels = [];
      const attrData = [];
      (report.attrList || []).forEach(attr => {
        labels.push(attr.attrName);
        attrData.push(attr.score);
      });
      const radarData = {
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
      const doughnutData = [
        {
          value: 90,
          color: '#57ddb1',
          highlight: '#57ddb1',
          label: '90'
        },
        {
          value: 10,
          color: 'rgba(255, 255, 255, 0)',
          highlight: '#5AD3D1',
          label: 'Green'
        }
      ];

      this.setState({
        name: user.name,
        report,
        radarData,
        doughnutData,
        reports: attrs
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
              <div className={styles.title}>智能分析</div>
              等接口
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
        </div>
      );
    });
  };

  renderTotalRadar = () => {
    const { name, report = {}, doughnutData, radarData } = this.state;
    const attrList = report.attrList || [];
    if (!attrList.length) return null;
    const attr = attrList[0].attrId;
    const attrLen = attrList.length;
    let summary = `[解读] ${name}宝贝，在${attrList[0].attrName}、${
      attrList[1].attrName
    }、${attrList[2].attrName}上有天赋特质。在${
      attrList[attrLen - 3].attrName
    }、
    ${attrList[attrLen - 2].attrName}、${
      attrList[attrLen - 1].attrName
    }的发展上略显不足，需要进一步加强。`;
    return (
      <>
        <div className={styles['pre-title']}>
          第一部分&nbsp;&nbsp;天赋测评总报告
        </div>
        <div className={styles.radarWrapper}>
          {radarData && (
            <Radar
              data={radarData}
              width={300}
              height={300}
              options={{
                legend: {
                  display: false
                }
              }}
            />
          )}
        </div>
        <div className={styles.para}>{summary}</div>
        <br />
      </>
    );
  };

  renderPrefix = () => {
    return (
      <>
        <div className={styles['pre-title']}>前言</div>
        <p className={styles.para}>
          尊敬的家长和亲爱的小朋友，从翻阅这份报告之时起，我们开启了探索儿童天赋之门。我们将一起一步一步深入了解孩子独特的智能结构，找出孩子的优势智能，培育孩子的天赋。我们所有的努力，是尽力揭示出蕴藏在孩子身体里面的、平常不容易观察到的特质。而这些特质可能对孩子的培养具有重要的参考价值。
        </p>
        <h3 className={styles['p-title']}>什么是天赋</h3>
        <p className={styles.para}>
          天赋是指在某些事物或领域具备天生擅长的能力，比如你一开始做某件事就能够毫不费劲地比别人做得更好。
        </p>
        <p className={styles.para}>
          天赋呈现出来的状态是:做自己擅长和热爱的事，并有卓越的品质。
        </p>
        <h3 className={styles['p-title']}>天赋启蒙的三个阶段</h3>
        <p className={styles.line}>我们通常把天赋启蒙分为三个阶段：</p>
        <p className={styles.line}>0-3岁的天赋启蒙期，我们简称为启蒙期。</p>
        <p className={styles.line}>3-6岁的发现培育期，我们简称为发现期。</p>
        <p className={styles.line}>6岁以上的定向培育期，我们简称为培育期。</p>
        <p className={styles.para}>
          启蒙期的关注重点在于环境的创设，这是因为3岁之前的孩子具有极强的吸收性心智，我们要给孩子创设能启蒙孩子天赋的环境，再小的家，也需要给孩子一个独立的空间，培养孩子的生活习惯，建立良好的行为及思维方式。
        </p>
        <p className={styles.para}>
          发现期的要点是，结合家长观察测评，自主游戏情境测评和老师在随堂课中记录孩子的表现，在培育中发现孩子的天赋。
        </p>
        <p className={styles.para}>
          培育期是指孩子经过了天赋启蒙期、发现期、已经有了明显的天赋特质，寻找在该领域有天赋并擅长教学的老师来引领，帮助孩子成就天赋的可能，借天赋立志向，创造培育孩子的条件。
        </p>
        <h3 className={styles['p-title']}>什么是八大智能</h3>
        <p className={styles.para}>
          霍华德加德纳教授被誉为多元智能理论之父，他在1983
          年参与美国哈佛大学“零点项目”过程中，提出了多元智能理论：加德纳把智能定义为“是在某种社会和文化环境的价值标准下，个体用以解决问题或生产及创造出某种产品所需要的能力”。每个人身上都有八种不同的智能：语言智能、音乐智能、空间智能、自然观察智能、逻辑数学智能、自我认知智能、人际认知智能、身体动觉智能。
        </p>
        <img className={styles['pro-img']} src="/static/img/pro/pro-2.png" />
        <span className={styles['pro-tips']}>一、语言智能：</span>
        <p className={styles.para}>
          语言智能( Linguistic
          intelligence)是指用言语思维、语言表达和欣赏语言深层内涵的能力，也就是人有效运用口头语言或文字语言的能力，这项智能包括把语言的结构、发音和意义等知识结合起来并运用自如的能力。这项智能涉及到人们对日头语言和书面语言的敏感程度，学习多种语言的能力以及使用语言达到某个目的的能力。一般来说律师、演说家、作家、诗人和教师通常都是具有较高语言智能的人。语言能力强的人在说明一项事物时，能够讲得条理分明、深入浅出，并适时列举恰当的例子，让人一听或一读就懂;他可能很擅长以言语带动他人的情绪或说服别人接受自己的观点，还可能很善于运用语言记忆信息或讲述语言本身。
        </p>
        <br />
        <p className={styles.line}>
          语言智能突出的儿童擅长通过说话、倾听和阅读来学习。
        </p>
        <br />
        <p className={classNames(styles.line, styles.bold)}>
          此项优势智能通常表现岀的天赋特质：
        </p>
        <br />
        <p className={styles.line}>1.喜欢听故事、猜谜语。</p>
        <p className={styles.line}>2.能说出大人讲话要点，而且能怡当回应。</p>
        <p className={styles.line}>
          3.词汇比较丰富，能够比较准确的表达自己的想法和愿望。
        </p>
        <p className={styles.line}>4.喜欢讲笑话、故事、说绕口令等。 </p>
        <p className={styles.line}>5.喜欢模仿人和动物的语言和声音。</p>
        <p className={styles.line}>6.喜欢阅读儿童图书，对汉字感兴趣。</p>
        <p className={styles.line}>
          7.很容易掌握新的语言，如其它地区地方话、英语等。
        </p>
        <p className={styles.line}>
          8.有很好的记忆力，能记得听过的故事、日常身边发生的事等。
        </p>
        <br />
        <span className={styles['pro-tips']}>二、音乐智能：</span>
        <p className={styles.para}>
          音乐智能( Musical
          intelligence)是指人敏锐地感知音调、旋律节奏和音色等能力，运用歌唱、欣赏和创作乐曲中的智能，即察觉辨别、改变和表达音乐的能力。音乐智能强的人，如歌唱家、音乐爱好者、音乐评论家、作曲家、音乐演奏家。
        </p>
        <p className={styles.para}>
          音乐智能强的儿童经常会不由自主地哼唱曲调，一听到音乐，他们马上就会随着音乐一起唱或随着音乐的节奏摇动身体。很多人会演奏某种乐器，或是参加学校的乐队、合唱团，但是也有些学生并不是以表达的方式，而是以欣赏的方式来体现音乐才能。他们对乐曲或歌曲的內涵有深刻的理解，能产生共鸣。他们对声音很敏感，有时别人听不到的细微声音，他们也可能会听到。
        </p>
        <br />
        <p className={classNames(styles.line, styles.bold)}>
          此项优势智能通常表现岀的天赋特质：
        </p>
        <br />
        <p className={styles.line}>
          1.能分辨和模仿周围环境中的噪声和大自然的声音，如汽车喇叭声火车鸣笛、下雨声、及各种动物的叫声等。
        </p>
        <p className={styles.line}>2.喜欢跟随音乐，自然地打节拍。</p>
        <p className={styles.line}>
          3.能随音乐节奏跳舞，动作合拍、协调、优美。
        </p>
        <p className={styles.line}>4.喜欢摆弄乐器。 </p>
        <p className={styles.line}>
          5.容易学会一首歌，唱歌时音调准确、表情自然、吐字清晰。
        </p>
        <p className={styles.line}>
          6.能较快掌握一种乐器的演奏方法，能分辨不同乐器演奏的音色。
        </p>
        <p className={styles.line}>
          7.能在音乐游戏、歌唱、乐器演奏中，即兴创编和表演。
        </p>
        <p className={styles.line}>8.能较准确听出同伴唱歌和演奏走调的地方。</p>
        <p className={styles.line}>
          9.能感受不同歌曲的风格差异，比如摇篮曲、进行曲和舞曲。
        </p>
        <p className={styles.para}>
          加德纳在《智能的结构》一书中将音乐智能放在第二位进行分析，可见他对音乐智能的看重。他认为音乐和语言一样都有久远的发展史，他们可能源于同一种表达媒介——声响的表达。按照加德纳的观点，在个体可能具有的天赋中，音乐天赋是最早出现的。
        </p>
        <br />
        <span className={styles['pro-tips']}>三、空间智能：</span>
        <p className={styles.para}>
          空间智能(Visual- spatial
          intelligence)是指人们利用三维空间的方式进行思维的能力，是在脑中形成一个外部空间世界的模式并能够运用和操作这一模式的能力。也就是准确地感觉视觉空间世界、辨别空间方向，例如猎人、侦察员或向导。并把所知觉到的表现出来以及用图画表达头脑中想像的概念，例如室内装潢师、建筑师、艺术家或发明家。这项智能包括对色彩、线条、形状、形式、空间及它们之间关系的敏感性，这其中也包括将视觉和空间的想法立体化地在脑海中呈现出来，以及在一个空间的矩阵中很快地找出方向的能力。空间智能使人能够知觉到外在和内在的图像，能够重现、转变或修饰心理图像，不但能够使自己在空间自由驰骋，有效地调整物体的空间位置，还能创造或解释图形信息。水手、工程师、外科医生、雕刻家、画家等都是具有高度发达的空间智能的例子。这方面发达的人，善于通过想像进行思考，对视觉空间的感受性强，能从不同角度和层面来重塑空间。
        </p>
        <p className={styles.para}>
          空间智能强的儿童，很清楚屋子里的东西都放在哪里，他们很会找东西。他们对教室设计的变化很敏感，能最先注意到教室内摆设的变化。他们喜欢玩拼图、爱画画。他们书中的空白处可能填满了他们的作品。他们爱设计东西、玩模型。他们喜欢摆动机器，家里的玩具会被他们拆掉。
        </p>
        <br />
        <p className={classNames(styles.line, styles.bold)}>
          此项优势智能通常表现岀的天赋特质：
        </p>
        <br />
        <p className={styles.line}>
          1.方向感强，善于识别路线，对前后、左右、东西、南北等空间方位关系明确。
        </p>
        <p className={styles.line}>
          2.喜欢看地图和地球仪，喜欢探究不同地名、城市、国家的位置关系。
        </p>
        <p className={styles.line}>
          3.喜欢阅读图画书，并喜欢用图画表达自己想象事物或故事情节。
        </p>
        <p className={styles.line}>4.喜欢玩拼图、走迷宫等空间视觉活动。</p>
        <p className={styles.line}>
          5.喜欢搭积木、捏橡皮泥等立体三维建构的活动。
        </p>
        <p className={styles.line}>
          6.对颜色敏感，喜欢绘画，能合理运用色彩、构建空间来突出主题。
        </p>
        <p className={styles.line}>
          7.空间视图感觉好，能看懂立体构图、玩具积木构图，分辨图片和照片上物体之间的空间位置关系等。
        </p>
        <p className={styles.line}>
          8.喜欢看电影、幻灯或其他视觉刺激的表演形式。
        </p>
        <p className={styles.line}>
          9.喜欢幻想，想象生活中事物的不同结局，或天马行空的想象宇宙中未知的事情。
        </p>
        <p className={styles.para}>
          加德纳认为，空间智能作为一种有悠久历史的智能，很容易在现有的一切人类文化中观察到。这种智能在许多科学领域的发展上都起到了重要的促进作用，科学家和发明家在进行科学研究时，经常借助于呈现鲜明的形象来解决问题，如开普勒发现苯的环状结构就受到扭曲的蛇形象的启发还有DNA的双螺旋结构的发现也有异曲同工之处。在艺术方面，空间思维的重要性尤为突出，绘画、雕塑、设计等都是需要对视觉和空间的世界有极敏锐的感受，那些世界美术史上的大师们或靠天赋或借助有目的的练习，使自己具有精确的视觉记忆和再现的能力，为我们创造无数伟大的作品。而在不同的文化和种族的生活中，空间智能也在扮演着重要的角色。
        </p>
        <br />
        <span className={styles['pro-tips']}>四、自然观察智能：</span>
        <p className={styles.para}>
          自然观察智能( Naturalist
          intelligence)是指观察自然界中事物的各种形态，对物体进行辨认和分类，能够洞察自然或人造系统的能力。这是加德纳在1983年并未提出，而在1995新扩充的一种智能类型。
        </p>
        <p className={styles.para}>
          加德纳认为这种智能的核心是一个人能辨识植物，对自然万物分门别类，并能运用这些能力从事生产。
        </p>
        <br />
        <p className={classNames(styles.line, styles.bold)}>
          此项优势智能通常表现岀的天赋特质：
        </p>
        <br />
        <p className={styles.line}>
          1.爱好大自然，有爱护环境、爱护动植物的意识和行动。
        </p>
        <p className={styles.line}>
          2.喜欢饲养小动物，关心它们的生长，能分辨常见的动物。
        </p>
        <p className={styles.line}>
          3.对四季天气的变化、雷电风雨等自然现象有浓厚的兴趣和探求的欲望。
        </p>
        <p className={styles.line}>
          4.喜欢辨别植物的种类，对它们的形状、颜色、气味敏感。
        </p>
        <p className={styles.line}>
          5.对自然界的某些事物有特别的兴趣，如收集树叶、石头、蝴蝶标本等。
        </p>
        <p className={styles.line}>
          6.喜欢参加户外的种植、采摘等活动，对植物生长特别好奇。
        </p>
        <p className={styles.line}>
          7.善于观察事物，比其它孩子更容易捕捉事物细节变化。
        </p>
        <p className={styles.line}>
          8.对《动物世界》之类有关大自然的电视节目，有浓厚的兴趣。
        </p>
        <p className={styles.para}>
          加德纳认为发展人的自然观察智能并不一定局限于自然世界，因为自然观察智能的本质是人对周围世界，包括自然和人文的观察、反映、联结、综合、条理化的能力。从这种观点岀发，培养自然观察智能就是要创造环境使儿童能够理解事物之间的联系。教师要引导儿童学会观察周围的世界，多与自然接触、多到博物馆去学习，要给他们提供机会亲身实验、探索自然界的规律。
        </p>
        <br />
        <span className={styles['pro-tips']}>五、逻辑数学智能：</span>
        <p className={styles.para}>
          逻辑数学智能( Logical- mathematical
          intelligence)是指人能够计算、量化、思考命题和假设，并进行复杂数学运算的能力，是有效地运用数字和逻辑推理以及科学分析的能力。这项智能包括对逻辑的方式和关系、陈述和主张(假设、因果等判断)、功能及其他相关的抽象概念的敏感性。用于逻辑数学智能的各种方法包括:分类、分等、推论、概括、计算和假设检验。逻辑数学智能强的人，如数学家、会计师、统计学家、科学家、电脑程序员或逻辑学家。
        </p>
        <p className={styles.para}>
          逻辑数学智能强的儿童习惯抽象思考，他们喜欢探索事物的模式类别和相互关系;他们会主动的、有计划的、有秩序的改变环境，实验种种不同的可能性，他们思考并质疑各种自然现象。
        </p>
        <br />
        <p className={classNames(styles.line, styles.bold)}>
          此项优势智能通常表现岀的天赋特质：
        </p>
        <br />
        <p className={styles.line}>
          1.喜欢和同伴做比较大小，多少、排序的游戏。
        </p>
        <p className={styles.line}>2.对数字运算活动感兴趣，心算能力较强。</p>
        <p className={styles.line}>
          3.对时间的概念清晰，明确时间早晚、先后关系。
        </p>
        <p className={styles.line}>
          4.喜欢根据长短、粗细、宽窄、几何图形等关系将事物分类，并能说出分类特征。
        </p>
        <p className={styles.line}>
          5.喜欢玩纸牌、下棋、玩电脑游戏等逻辑推理活动。
        </p>
        <p className={styles.line}>6.喜欢询问为什么，并努力寻求答案。</p>
        <p className={styles.line}>
          7.喜欢看侦探故事片，清楚人物关系、故事情节发展变化等。
        </p>
        <p className={styles.line}>8.喜欢做科学实验，有强烈的探究欲望。</p>
        <p className={styles.para}>
          加德纳认为逻辑数学智能与语言和音乐智能不同，它不是发源于听觉和声音的领域，而是起源于人与对象世界的相遇，因为在与对象的相遇中，在安排与重新安排他们，在估计他们的数量时，才获得了逻辑——数学领域最初的、最基本的內容。
        </p>
        <p className={styles.para}>
          在论述逻辑数学智能时，加徳纳借鉴了皮亚杰的硏究。加德纳认为，皮亚杰对逻辑数学智能的发展研究非常杰出，他从儿童对物质世界的行为中找到了逻辑数学智能的根源，通过对儿童发展的论述揭示了逻辑数学智能的本质。尽管有专家认为逻辑和数学是两回事，但加德纳认为逻辑和数学虽然有不同的发展历史，但是他们现在走在一起了。因为要想在两者之间划一条分界线，是不可能的，它们的区别就像男孩子和男人的区别一样，逻辑是数学的青年阶段，而数学又是逻辑的成人阶段。
        </p>
        <br />
        <span className={styles['pro-tips']}>六、自我认知智能：</span>
        <p className={styles.para}>
          自我认知智能( Intrapersonal
          intelligence)是指关于构建正确自我知觉的能力，并善于用这种知识计划和导引自己人生，或者说有自知之明，并据此做出适当行为的能力。这项智能包括对自己的了解，例如自己的长处和短处，意识到自己的内在情绪、意向、动机、脾气和需求以及自律、自尊、自控的能力。自我认知智能强的人，能深入探索自己的内心世界，分辨自己的心理状态，理解自我的内在感情并根据对自我的了解来调节自己的行为。
        </p>
        <p className={styles.para}>
          自我认知智能强的儿童个性比较强，他们往往不喜欢群体活动，喜欢自己独处，喜欢通过记日记的方式表达自己的秘密，他们一般都有自己清晰的目标，会为自己心中的目标而努力。
        </p>
        <br />
        <p className={classNames(styles.line, styles.bold)}>
          此项优势智能通常表现岀的天赋特质：
        </p>
        <br />
        <p className={styles.line}>
          1.做事情很专注，如在看书时，能坚持较长的时间，并能排除干扰。
        </p>
        <p className={styles.line}>2.能积极评价自己的优缺点，并说出理由。</p>
        <p className={styles.line}>
          3.遇到问题时，能积极想办法，失败后也愿意继续努力。
        </p>
        <p className={styles.line}>
          4.自己选择游戏，并对该怎么玩有自己的想法。
        </p>
        <p className={styles.line}>5.生活中会关心、帮助、爱护他。</p>
        <p className={styles.line}>6.自理能力较强，自己的事情愿意自己做。</p>
        <p className={styles.line}>
          7.一般情绪状态良好，遇上不愉快的事，能够及时调整，恢复正常情绪。
        </p>
        <p className={styles.line}>
          8.能自觉遵守规则，如能遵守公共礼仪、维护环境卫生、游戏规则等。
        </p>
        <p className={styles.line}>
          9.做错事后，能虚心接受建议，承认错误并能从中吸取教训。
        </p>
        <p className={styles.para}>
          加德纳认为在人格的发展中有两个发展方向，一个是人内在方面的发展，另一个是转向外部、转向其他个体的发展，向内在方向发展的就是自我认知智能，而转向外部的就是人际关系智能。
        </p>
        <br />
        <span className={styles['pro-tips']}>七、人际认知智能：</span>
        <p className={styles.para}>
          人际认知智能( Interpersonal
          intelligence)是指能够有效地理解别人和与人交往的能力，是一个人在与他人交往的过程中察觉并区分他人的情绪、意向、动机及感觉的能力。这包括对面部表情、声音和动作的敏感性，辨别不同人际关系的暗示以及对这些暗示做出适当的反应。
        </p>
        <p className={styles.para}>
          人际交往智能强的人，往往能察言观色、善解人意，与人相处融洽，通常还有很好的组织能力和领导能力。成功的销售商、政治家、教师、心理医生等等都是拥有高度人际认知智能的人。
        </p>
        <p className={styles.para}>
          人际交往智能强的孩子解别人的能力很强，他们善于组织、沟通甚至控制他人。因为他们很了解别人的想法和意图，所以他们容易成为群体的领导，也很容易成为群体的协调人。
        </p>
        <br />
        <p className={classNames(styles.line, styles.bold)}>
          此项优势智能通常表现岀的天赋特质：
        </p>
        <br />
        <p className={styles.line}>
          1.有几个固定的好朋友，喜欢参加集体活动，并能维护集体荣誉。
        </p>
        <p className={styles.line}>2.在与同伴游戏活动中，常是活动组织者。</p>
        <p className={styles.line}>
          3.能感受他人如伙伴、家长、教师等的情绪变化，并适时调整自己的行为。
        </p>
        <p className={styles.line}>
          4.与人相处时，能使用适宜礼貌用语，举止文明大方。
        </p>
        <p className={styles.line}>
          5.能熟练运用语言、表情和行为等来表达自己的想法和感情。
        </p>
        <p className={styles.line}>
          6.擅长向他人模仿学习，乐于倾听他人的想法和建议。
        </p>
        <p className={styles.line}>7.能帮助调解其他小朋友之间的纠纷。</p>
        <br />
        <span className={styles['pro-tips']}>八、身体动觉智能：</span>
        <p className={styles.para}>
          身体动觉智能( Bodily- kinesthetic
          intelligence)是指善于控制身体运动，善于运用身体动作表达思想和情感以及运用双手灵巧地的操作物体的智能。这项智能包括特殊的身体技巧，如协调、平衡、敏捷、力量、弹性和速度以及自身感受的、触觉的和由触觉引起的能力。舞蹈家、运动员外科医生、手工艺大师等都表现出高度发达的身体动觉智能。
        </p>
        <p className={styles.para}>
          很多人在理解和记忆信息时，习惯通过触觉和运动过程，如果大家还记得海伦·凯勒的话，那就一定会明白触觉学习是多么的重要，尽管我们没有像她那样失去视觉，但确实是有些孩子触觉运动神经通路比其他通路更有效。他们要以动手摆弄物体和亲身体验去学习、理解，如果掐断这条通路，只要他们借助听和看学习，对他们而言是非常困难的。按皮亚杰的理论，对所有年幼的儿童来说，感觉运动学习是他们最重要的学习方式。不幸的是，在学校中视觉的学习和听觉的学习占据了主要位置，儿童的学习主要借助于读书和听讲，运用身体运动进行学习的机会太少了。
        </p>
        <p className={styles.para}>
          身体动觉智能强的孩子，通过身体感官进行学习，他们好动，坐不住，在他们之中有些擅长舞蹈;有些喜欢表演、模仿;有些在做手工。他们很会通过手势、身体动作与别人沟通。如果没有机会运用他们的运动智能，他们可能在教室中表现出过分好动的行为。
        </p>
        <br />
        <p className={classNames(styles.line, styles.bold)}>
          此项优势智能通常表现岀的天赋特质：
        </p>
        <br />
        <p className={styles.line}>
          1.喜欢体育活动，手脚动作协调性好，身体灵活、反应敏捷、平衡性好。
        </p>
        <p className={styles.line}>2.喜欢模仿人和动物的行为和姿态。</p>
        <p className={styles.line}>
          3.喜欢手工制作，如剪纸、组装机械模型、搭积木等活动。
        </p>
        <p className={styles.line}>
          4.喜欢用身体和触觉来感受物体，如触摸、摆弄、拆装物品。
        </p>
        <p className={styles.line}>
          5.能很快掌握动作要领，如在跳舞、做律动、体操等活动中，表现突岀。
        </p>
        <p className={styles.line}>
          6.喜欢用肢体语言表达自己的感受，如说话时手舞足蹈、做鬼脸，或根据音乐起舞等。
        </p>
        <br />
        <h3 className={styles['p-title']}>八大智能与天赋的关系</h3>
        <p className={styles.para}>
          美国哈佛大学霍华德加德纳教授认为，在正常条件下，只要有适当的外界刺激和个体本身的努力，每个个体都能发展和加强自己的任何一种智能，他们的潜能可以为他们创造出不同的成功机会。我们把这种潜能或强项智能表现出来的独特能力理解为天赋。
        </p>
        <h3 className={styles['p-title']}>如何解读测评结果</h3>
        <p className={styles.para}>
          我们建议父母在阅读本报告后，是致力于思考如何有针对性地培养孩子，而不是给孩子贴标签，例如“这个骇子很聪明”、“那个孩子不聪明”。
        </p>
        <p className={styles.para}>
          美国哈佛大学著名教育心理学家霍华德·加德纳数授（H.Gardner）有一句名言：“任何孩子都有其优势智能领域”。所以，我们并不想给任何一个孩子贴上“天才”或“笨蛋”的标签，我们只希望通过专业的生物信息学分析和评估，能够在一定程度上呈现孩子的一些基本的生物学属性发现孩子的潜能，并建议教育工作者因材施教。在这种思想下，每个孩子都可以成才，在各自的优势领域里成为有用之才。
        </p>
        <p className={styles.para}>
          作为一本发现孩子天赋的报告。它是与教育培养工作相配合的。孩于的天赋潜能要通过有针对性的教有训才能得到发展，从而将天赋潜能转化成可以利用的能力。因比，本报告可以提供给所有可能教育培训这个孩子的教育培训机构的教师做参考。
        </p>
        <p className={styles.para}>
          另外，深入的咨询可以帮助我们更好地了解孩子。阅读者对本报告有任何不解或疑问，应当与天赋启蒙中心的专业人员进行讨论，专业的人员会向您解释本报告的内涵，以及我们为什么会做出这样的判断。相信通过良好的沟通和专业的评估，我们一定能够为广大家长提供一份专业的、科学的、有参考价值的评估报告。
        </p>
      </>
    );
  };

  renderPersonal = () => {
    const { reports } = this.state;
    return reports.map((attr, index) => {
      let labels = [];
      const attrData = [];
      (attr.radarData || []).forEach(attr => {
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
      return (
        <>
          <img
            className={styles['pro-img']}
            src={`/static/img/pro/attr-${index + 1}.png`}
          />
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
        </>
      );
    });
  };

  renderSuggestions = () => {
    const { reports } = this.state;
    const advantages = reports.slice(0, 3);
    const disadvantages = reports.slice(5);
    const getAttrs = attrs => {
      return attrs.map(report => {
        const {
          attr = {},
          result = [],
          raise = [],
          direction = [],
          game1 = [],
          game2 = [],
          game3 = []
        } = report;
        const games = [game1, game2, game3];
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
              <div className={styles.card}>
                <div className={styles.title}>教育游戏</div>
                <div className={styles.content}>
                  {games.map(item => {
                    return (
                      <div>
                        <div className={styles.bold}>{item[0]}</div>
                        <div>{item[1]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      });
    };

    return (
      <>
        <div className={styles['pre-title']}>个性化培育建议</div>
        <h3 className={styles['p-title']}>三项优势智能</h3>
        <div className={styles['second-title']}>解读与培优</div>
        {getAttrs(advantages)}
        <h3 className={styles['p-title']}>三项劣势智能</h3>
        <div className={styles['second-title']}>解读与补弱</div>
        {getAttrs(disadvantages)}
      </>
    );
  };

  renderSuffix = () => {
    return (
      <>
        <div className={styles['pre-title']}>顺强补弱”，成就天赋宝贝</div>
        <p className={styles.para}>
          天赋是大自然赋予儿童最宝贵的礼物。它独树一帜，特殊而又有个性。每个儿童都具有属于自己独特的天赋，这份天赋让TA与众不同、独具一格，是TA成功道路上的助推力和指向标。天赋与宝贝的智能发展、教育环境、幸福能力都息息相关。
        </p>
        <h3 className={styles['p-title']}>天赋与教育环境</h3>
        <p className={styles.para}>
          天赋既有先天生理因素，也有后天实践和培养教育因素，任何的天赋，都离不开教育环境的支持。朗朗因父亲发现他的音乐天赋并给予全力的呵护和支持，成为当代的钢琴家。如果贝多芬一出生就被送去了美术班，如果让毕加索去学跳舞，让舞蹈家杨丽萍学数学……这些听上去不可思议的假设，其实每天都发生在我们身边。一个孩子从小学习那么多的兴趣班，可很多孩子到了填志愿时都还不清晰自己的定位。我们不禁想起一句话“教育就是把人的内心引导出来，成为他自己的样子。”
        </p>
        <br />
        <p className={styles.para}>
          我们需要去发现个体的优势智能，但如何给予孩子好的成长和教育环境，将决定这个人最终的成就。关于智能的性质，加德纳认为尽管在各种环境和教育条件下个体身上都存在着这八种智能，但不同环境和教育条件下个体的智能发展方向和程度有明显的差异性。尊重儿童的个别差异，每个儿童都有不同的能力，且以不同的方式展示出来。
        </p>
        <br />
        <p className={styles.para}>
          我们需要去发现个体的优势智能，但如何给予孩子好的成长和教育环境，将决定这个人最终的成就。关于智能的性质，加德纳认为尽管在各种环境和教育条件下个体身上都存在着这八种智能，但不同环境和教育条件下个体的智能发展方向和程度有明显的差异性。尊重儿童的个别差异，每个儿童都有不同的能力，且以不同的方式展示出来。
        </p>
        <br />
        <img className={styles['pro-img']} src="/static/img/pro/pro-3.png" />
        <h3 className={styles['p-title']}>天赋与幸福能力</h3>
        <p className={styles.para}>
          如果说成功是他人眼中的杰出表现，而幸福则是自己内心最深层次的满足感。天赋是打造幸福的关键。过去，很多的父母都在关注“孩子是否会输在起跑线上”，未来，我们是否要更注重，“如何让一个孩子获得终生幸福的能力？”
        </p>
        <br />
        <p className={styles.para}>
          很多父母在培育孩子的过程中，或对孩子人生未来的期望中，都会说只要孩子健康、快乐就行。我们的孩子是一个有着复杂感受的人，因此，他会随着成长环境、心理都会有变化。我们不仅要让孩子快乐学习，更要让孩子有个长久的快乐，我们暂且称他为幸福能力吧。
        </p>
        <br />
        <p className={styles.para}>
          有人说“幸福是因个人理想的实现或接近，而得到内心的满足感。”，那身为父母或老师要考虑三个问题，这个孩子的理想是什么，这是孩子擅长的优势么？给予什么样的环境可以让她或他实现？
        </p>
        <br />
        <p className={classNames(styles.line, styles.bold)}>
          天赋测评，让家长具备这样一双发现天赋的“慧眼”，全面认识宝贝，帮助TA顺强补弱，成就天赋宝贝！
        </p>
        <br />
      </>
    );
  };

  render() {
    return (
      <div className={styles.page}>
        <img className={styles['pro-img']} src="/static/img/pro/pro-1.jpg" />
        {this.renderPrefix()}
        {this.renderTotalRadar()}
        {this.renderPersonal()}
        {/* {this.renderReport()} */}
        {this.renderSuggestions()}
        {this.renderSuffix()}
      </div>
    );
  }
}

export default PageWrapper(createForm()(Page));
