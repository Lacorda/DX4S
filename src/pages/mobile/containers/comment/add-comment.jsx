import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { comment as infoActions } from '../../actions';

import Rate from '../../../../components/rate';
import Button from '../../../../components/button';
import { Alert } from '../../../../components/modal/index';

const propTypes = {
  actions: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  addMsg: PropTypes.object.isRequired,
};

const contentTypes = {
  router: PropTypes.object.isRequired,
};

class AddComment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      isInitScore: true,
      isSaveAlertOpen: false,
      saveErrMsg: '保存失败',
    };
    this.handleClickSave = this.handleClickSave.bind(this);
    this.handlerChangeContext = this.handlerChangeContext.bind(this);
    this.closeSavaAlert = ::this.closeSavaAlert;
  }

  componentDidMount() {
    this.props.actions.fetchComment({
      biz_id: this.props.params.course_id,
      type_code: 'course',
    });
  }

  componentWillReceiveProps(nextProps) {
    const { info, addMsg } = nextProps;

    if (info.dimensions && this.state.isInitScore) {
      info.dimensions.forEach((item, index) => {
        this.setState({ ...this.state, isInitScore: false, [`score${index}`]: item.dimension_score });
      });
    }

    if (addMsg.errMsg) {
      this.setState({ ...this.state, saveErrMsg: addMsg.errMsg, isSaveAlertOpen: true });
    }

    if (addMsg.saveSuccess) {
      const self = this;
      setTimeout(() => {
        self.context.router.replace(`/plan/${self.props.params.plan_id}/series/${self.props.params.solution_id}/courses/${self.props.params.course_id}/comments`);
      }, 100);
    }
  }

  handleClickSave() {
    const dimensions = [];

    if (this.props.info.dimensions) {
      this.props.info.dimensions.forEach((item, index) => {
        const rateInfo = {};
        rateInfo.user_score = this.state[`score${index}`];
        rateInfo.dimension_id = item.dimension_id;
        dimensions.push(rateInfo);
      });
    }

    const data = {
      dimensions,
      biz_id: this.props.params.course_id,
      type_code: 'course',
      content: this.state.content,
    };

    this.props.actions.addComment(data);
  }

  // 评价内容
  handlerChangeContext(event) {
    this.state.content = event.target.value;
  }

  // 错误消息alert关闭
  closeSavaAlert() {
    this.setState({ ...this.state, isSaveAlertOpen: false });
    this.context.router.replace(`/plan/${this.props.params.plan_id}/series/${this.props.params.solution_id}/courses/${this.props.params.course_id}/comments`);
  }

  render() {
    const { info } = this.props;
    const self = this;

    if (!info.dimensions) {
      info.dimensions = [];
    }

    return (
      <div className="comment">
        <ul className="c-add-rate">
          <li>
            {
              info.dimensions.map((item, index) => (
                <p key={index}>{item.dimension_name}</p>
              ))
            }
          </li>
          <li>
            <div>
              {
                info.dimensions.map((item, index) => (
                  <Rate
                    key={index}
                    score={self.state[`score${index}`]}
                    click={
                      function setScore(score) {
                        self.setState({ ...self.state, [`score${index}`]: score });
                      }
                    }
                  />
                ))
              }
            </div>
          </li>
        </ul>
        <div className="c-textarea">
          <textarea className="textarea-contral" placeholder="请输入评价" onChange={this.handlerChangeContext} />
        </div>
        <div className="c-btn">
          <Button type="primary" onClick={this.handleClickSave}><FormattedMessage id="app.comment.submit" /></Button>
        </div>
        <Alert
          isOpen={this.state.isSaveAlertOpen}
          onRequestClose={this.closeSavaAlert}
          confirmButton={<span>确定</span>}
        >
          <span>{this.state.saveErrMsg}</span>
        </Alert>
      </div>
    );
  }
}

AddComment.propTypes = propTypes;
AddComment.contextTypes = contentTypes;

const mapStateToProps = state => (
  {
    addMsg: state.comment.detail.addMsg || {},
    info: state.comment.detail.info || {},
    isFetching: state.comment.detail.isFetching || false,
  }
);

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(infoActions, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(AddComment);
