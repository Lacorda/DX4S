import React, { Component, PropTypes } from 'react';
import Connect from '../../../connect';
import classNames from 'classnames';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Toast from 'components/modal/toast';

function getReadStatusLine(hasRead) {
  return {
    name: true,
    read: hasRead === 0,
  };
}

// 1 视频, 2 文档, 3 练习, 4 音频, 5 图片, 6 直播, 7 H5 9, 问卷
const typeNum2Str = [
  'video',
  'doc',
  'practice',
  'audio',
  'img',
  'live',
  'h5',
  null,
  'survey',
];

function nodeTypeIcon(type, hasRead, isOrder, preNode) {

  const typeIcon = isOrder ? `${typeNum2Str[type - 1]}-lock` : typeNum2Str[type - 1];

  const cls = {
    type: true,
  };

  if (isOrder && hasRead === 0) {
    if (preNode == null || preNode.done === 1) {
      cls[`${typeIcon}-readable`] = true;
      return cls;
    }
  }

  if (hasRead === 0) {
    cls[typeIcon] = true;
    return cls;
  }

  cls[`${typeIcon}-read`] = true;
  return cls;
}

class Chapter extends Component {
  constructor(props, context) {
    super(props, context);
    this.openToast = this.openToast.bind(this);
    this.state = {
      isToastShow: false,
    };
  }

  openToast() {
    this.setState({ isToastShow: true });
  }

  render() {
    // const { chapters, nodes } = this.props;
    const props = this.props;
    const chapters = this.props.chapters;
    const nodes = this.props.nodes;
    const detail = this.props.detail;
    const self = this;

    return (
      <div className="widget mb50">
        <div className="widget-header"><FormattedMessage id="app.course.catalog" /></div>
        <div className="widget-body">
          {
            chapters.items.map((chapter, chapterIndex) => (
              <div className="learning-chapter" key={chapter.id}>
                <div className="chapter-title">
                  <span>{chapter.name}</span>
                </div>
                <ul className="chapter-list">
                  {
                    chapter.nodes.map((id, index) => {
                      const node = nodes[id];
                      const isOrder = detail.info.is_order;
                      let preNode = null;

                      if (isOrder) {
                        if (index === 0 && chapterIndex > 0) {
                          const preIndex = chapters.items[chapterIndex - 1].nodes.length;
                          if (preIndex) {
                            const preNodeId = chapters.items[chapterIndex - 1].nodes[preIndex - 1];
                            preNode = nodes[preNodeId];
                          }
                        }
                        if (index > 0) {
                          const preNodeId = chapter.nodes[index - 1];
                          preNode = nodes[preNodeId];
                        }
                      }

                      return (
                        <li key={id}>
                          {
                            (() => {
                              const planId = props.planId || 0;
                              const solutionId = props.solutionId || 0;
                              const courseId = props.courseId || 0;

                              if (isOrder && preNode != null && preNode.done === 0) {
                                return (
                                  <Link onClick={this.openToast}>
                                    <div className={classNames(getReadStatusLine(node.done))}>
                                      <span className={classNames(nodeTypeIcon(node.type, node.done, isOrder, preNode))} />
                                      <p>
                                        <div className="name">{index + 1}.{node.name}</div>
                                        {
                                          (() => {
                                            if (node.done === 1) {
                                              return (<div className="tag"></div>);
                                            }
                                            return null;
                                          })()
                                        }
                                      </p>
                                    </div>
                                  </Link>
                                );
                              }
                              return (
                                <Link
                                  to={`/preview/plan/${planId}/series/${solutionId}/courses/${courseId}`}
                                  query={{ node_id: node.id }}
                                >
                                  <div className={classNames(getReadStatusLine(node.done))}>
                                    <span className={classNames(nodeTypeIcon(node.type, node.done, isOrder, preNode))} />
                                    <p>
                                      <div className="name">{index + 1}.{node.name}</div>
                                      {
                                        (() => {
                                          if (node.done === 1) {
                                            return (<div className="tag"></div>);
                                          }
                                          return null;
                                        })()
                                      }
                                    </p>
                                  </div>
                                </Link>
                                );
                            })()
                          }
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            ))
          }
        </div>

        <Toast
          style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.25)' } }}
          isOpen={this.state.isToastShow}
          timeout={2000}
          shouldCloseOnOverlayClick={false}
          onRequestClose={() => {
            self.setState({ isToastShow: false });
          }}
        >
          <div>请按顺序学习课件</div>
        </Toast>
      </div>
    );
  }
}

export default Connect(Chapter);
