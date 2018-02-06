/**
 * 商品详情-课程
*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Toast from 'components/modal/toast';
import { products as productActions } from '../../actions';
import messages from './messages';
import './product.styl';

class ProductCourse extends Component {
  static propTypes() {
    return {
      productInfo: PropTypes.array,
      query: PropTypes.object,
      fetchParams: PropTypes.object,
    };
  }

  constructor(props, context) {
    super(props, context);
    this.goToPreview = ::this.goToPreview;
    this.state = {
      isToastShow: false,
    };
  }

  goToPreview(node) {
    const typs = [
      'video',
      'doc',
      'audio',
    ];
    if (typs.indexOf(node.type) < 0) {
      this.setState({ isToastShow: true });
      return;
    }

    const { fetchParams, query } = this.props;
    const router = this.context.router;

    router.push(router.createPath(`mall/preview/products/${fetchParams.productId}/node/${node.id}`, query));
  }

  render() {
    const self = this;
    const { productInfo } = this.props;
    const getNodeType = function noteType(type) {
      const cls = {
        type: true,
      };
      cls[type] = true;
      return cls;
    };

    return (
      <div>
        <div className="widget">
          <div className="widget-header"><FormattedMessage id="app.course.catalog" /></div>
          <div className="widget-body">
            {
              productInfo.chapters.map(chapter => (
                <div className="learning-chapter" key={chapter.id}>
                  <div className="chapter-title">
                    <span>{chapter.name}</span>
                  </div>
                  <ul className="chapter-list">
                    {
                      chapter.nodes.map(node => (
                        <li key={node.id} onClick={() => this.goToPreview(node)}>
                          <div className="name">
                            <span className={classNames(getNodeType(node.type))}></span>
                            {
                              (() => {
                                const typs = [
                                  'video',
                                  'doc',
                                  'audio',
                                ];
                                if (typs.indexOf(node.type) < 0) {
                                  return (
                                    <p>{node.name}</p>
                                  );
                                }
                                return (
                                  <p>
                                    <div className="name-title">{node.name}</div>
                                    <div className="name-view"><FormattedMessage id="app.product.preview" /></div>
                                  </p>
                                );
                              })()
                            }
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              ))
            }
          </div>
        </div>
        {
          /* 训练方式 */
          (() => {
            if (productInfo.assessment) {
              if (!productInfo.assessment.examination_vo) {
                productInfo.assessment.examination_vo = {};
              }
              const passType = productInfo.assessment.pass_type;
              const learningType = productInfo.assessment.learning_type;
              const learningTimeMsg = {
                num: productInfo.assessment.learning_times || '1',
              };

              return (<div className="widget">
                <div className="widget-header mb24"><FormattedMessage id="app.course.train" /></div>
                <div className="widget-body ml24">
                  <div className="train-title pb24">
                    {
                      (() => {
                        switch (passType) {
                          case 'read':
                            return (<span className="mr20"><FormattedMessage id="app.product.train1" /></span>);
                          case 'practice':
                            return (<span className="mr20"><FormattedMessage id="app.product.train2" /></span>);
                          case 'scene':
                            return (<span className="mr20"><FormattedMessage id="app.product.train3" /></span>);
                          default:
                            return null;
                        }
                      })()
                    }
                  </div>
                  <div className="train-line pb24">
                    {
                      /* 复习方式 */
                      (() => {
                        switch (learningType) {
                          case 'repeat':
                            return (<div className="train-count">
                              <span className="pr16"><FormattedMessage id="app.product.repeat" />:</span>
                              <FormattedMessage id="app.product.repeatValue" values={learningTimeMsg} />
                            </div>);
                          case 'continuous':
                            return (<div className="train-time">
                              <span className="pr16"><FormattedMessage id="app.product.continuous" />:</span>
                              <FormattedMessage id="app.product.continValue" values={learningTimeMsg} />
                            </div>);
                          default:
                            return null;
                        }
                      })()
                    }
                  </div>
                  <div className="train-desc pb24">
                    {productInfo.assessment.examination_vo.name}
                  </div>
                </div>
              </div>);
            }
            return null;
          })()
        }
        {
          /* 通过考试 */
          (() => {
            if (productInfo.exam) {
              const duration = productInfo.exam.duration;
              const allowTimes = productInfo.exam.allow_test_times;
              const passScoreMsg = {
                num: productInfo.exam.pass_score || '0',
              };
              const allowTimeMsg = {
                num: allowTimes,
              };
              const examTimes = function getExamTime() {
                const time = {
                  hours: '00',
                  minutes: '00',
                  seconds: '00',
                };

                if (duration < 60) {
                  time.seconds = duration;
                  return time;
                }

                if (duration > 3600) {
                  time.hours = parseInt(duration / 3600, 0);
                }
                if (parseInt(duration % 3600, 0) >= 60) {
                  time.minutes = parseInt((duration % 3600) / 60, 0);
                }
                if (parseInt(duration % 3600, 0) >= 60) {
                  time.minutes = parseInt((duration % 3600) / 60, 0);
                  if (time.minutes === 0) {
                    time.minutes = '00';
                  }
                }
                return time;
              };
              const examTimeKey = function getExamTimeKey() {
                if (duration < 60) {
                  return 'productExamTimeValueS';
                }

                let h = 0;
                let m = 0;
                if (duration > 3600) {
                  h = parseInt(duration / 3600, 0);
                }
                if (parseInt(duration % 3600, 0) >= 60) {
                  m = parseInt((duration % 3600) / 60, 0);
                }
                if (h > 0 && m > 0) {
                  return 'productExamTimeValueHM';
                }
                if (h > 0 && m === 0) {
                  return 'productExamTimeValueH';
                }
                return 'productExamTimeValueM';
              };

              return (<div className="widget">
                <div className="widget-header mb24"><FormattedMessage id="app.course.exam" /></div>
                <div className="widget-body ml24">
                  <div className="exam-title pb24">
                    <span className="mr20"><FormattedMessage id="app.product.exam" /></span>
                  </div>
                  <div className="train-line pb24">
                    <div className="train-score">
                      <span className="pr16"><FormattedMessage id="app.product.passScore" />:</span>
                      <FormattedMessage id="app.product.passScoreValue" values={passScoreMsg} />
                    </div>
                  </div>
                  <div className="train-line pb24">
                    <div className="train-count pr16">
                      <span className="pr16"><FormattedMessage id="app.product.examTime" />:</span>
                      <FormattedMessage {...messages[examTimeKey()]} values={examTimes()} />
                    </div>
                    <div className="train-time">
                      <span className="pr16"><FormattedMessage id="app.product.examCount" />:</span>
                      {
                        (() => {
                          if (allowTimes) {
                            return <FormattedMessage id="app.product.examCountValue1" values={allowTimeMsg} />;
                          }
                          return <FormattedMessage id="app.product.examCountValue2" />;
                        })()
                      }
                    </div>
                  </div>
                  <div className="train-desc pb24">
                    {productInfo.exam.name}
                  </div>
                </div>
              </div>);
            }
            return null;
          })()
        }
        <Toast
          style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.25)' } }}
          isOpen={this.state.isToastShow}
          timeout={2000}
          shouldCloseOnOverlayClick={false}
          onRequestClose={() => {
            self.setState({ isToastShow: false });
          }}
        >
          <div><FormattedMessage id="app.product.disabledPreview" /></div>
        </Toast>
      </div>
    );
  }
}

ProductCourse.contextTypes = {
  router: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  productInfo: state.products.detail,
  query: ownProps.query,
  fetchParams: ownProps.fetchParams,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(productActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductCourse);
