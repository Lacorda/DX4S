/**
 * 课程详情-简介
*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Alert from '../../components/alert';
import { course as courseActions } from '../../actions';

class CourseDetail extends Component {
  static propTypes() {
    return {
      actions: PropTypes.object.isRequired,
      fetchParams: PropTypes.object.isRequired,
      courseInfo: PropTypes.object.isRequired,
      chapters: PropTypes.array.isRequired,
      nodes: PropTypes.object.isRequired,
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      isToastShow: false,
      toastMsg: '',
    };
    this.nodeClick = ::this.nodeClick;
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchChapter({
      plan_id: fetchParams.planId,
      solution_id: fetchParams.solutionId || 0,
      course_id: fetchParams.courseId,
    });
  }

  getCurrentNodeIsLock(chapter, chapterIndex, nodeIndex) {
    const { courseInfo, chapters, nodes } = this.props;
    if (!courseInfo.is_order) {
      return false;
    }

    /* preNode = 上一章的最后一个节点 */
    if (nodeIndex === 0 && chapterIndex > 0) {
      const preIndex = chapters[chapterIndex - 1].nodes.length;
      if (preIndex) {
        const preNodeId = chapters[chapterIndex - 1].nodes[preIndex - 1];
        return !nodes[preNodeId].done;
      }
    }

    if (nodeIndex > 0) {
      const preNodeId = chapter.nodes[nodeIndex - 1];
      return !nodes[preNodeId].done;
    }

    return false;
  }

  nodeClick(node, isLock) {
    if (isLock) {
      this.setState({ isToastShow: true, toastMsg:  this.context.intl.messages['app.course.orderMsg'] });
      return;
    }

    const { fetchParams } = this.props;
    const router = this.context.router;
    const path = `/preview/plan/${fetchParams.planId}/series/${fetchParams.solutionId || 0}/courses/${fetchParams.courseId}`;
    router.push(router.createPath(path, {
      node_id: node.id,
    }));
  }

  render() {
    const self = this;
    const { courseInfo, chapters, nodes } = this.props;
    return (
      <div>
        <div className="description" dangerouslySetInnerHTML={{ __html: courseInfo.course_info }}></div>
        <div className="catalog">
          <span className="catalog-title">{this.context.intl.messages['app.course.catalog']}</span>
          {
            chapters.map((chapter, chapterIndex) => (
              <div className="chapter" key={chapter.id}>
                <div className="chapter-title">
                  {chapter.name}
                </div>
                <ul className="chapter-list">
                  {
                    chapter.nodes.map((id, index) => {
                      const node = nodes[id];
                      const isLock = this.getCurrentNodeIsLock(chapter, chapterIndex, index);
                      let cls = 'done';
                      if (!node.done) {
                        cls = isLock ? 'node-lock' : 'play';
                      }
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

                      return (
                        <li className={`node ${node.done === 1 ? 'read' : ''} ${cls}`} key={id} onClick={() => { this.nodeClick(node, isLock); }}>
                          <div className="node-title play">{node.name}</div>
                          <div className={`node-type ${typeNum2Str[node.type - 1]}-${node.done}`}>&nbsp;</div>
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            ))
          }
        </div>

        <Alert
          isShow={this.state.isToastShow}
          imgType={'warning'}
          onRequestClose={() => {
            self.setState({ isToastShow: false });
          }}
        >
          {this.state.toastMsg}
        </Alert>
      </div>
    );
  }
}

CourseDetail.contextTypes = {
  router: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  fetchParams: ownProps.fetchParams,
  courseInfo: state.course.detail.info,
  chapters: state.course.chapter.items,
  nodes: state.course.nodes,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({},
    courseActions),
    dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CourseDetail);
