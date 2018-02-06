import React, { Component, PropTypes } from 'react';
import api from 'utils/api';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import Toast from '../../components/alert';
import DxHeader from '../../components/header';
import DxFooter from '../../components/footer';
import SubNav from '../../components/sub-nav';

const contextTypes = {
  intl: React.PropTypes.object.isRequired,
};
class Feedback extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      btnSubmit: false,
      isSaveAlertOpen: false,
      isClearInput: false,
      saveErrMsg: '',
      type: null,
      content: '',
      saveResType: 'success',
    };

    this.handlerChangeContext = ::this.handlerChangeContext;
    this.handleClickSave = ::this.handleClickSave;
    this.handleType = ::this.handleType;
    this.closeSaveAlert = ::this.closeSaveAlert;
  }

  // 反馈内容
  handlerChangeContext(event) {
    this.state.content = event.target.value;
    if (this.state.content && this.state.content !== '') {
      this.setState({ ...this.state, btnSubmit: true });
    } else {
      this.setState({ ...this.state, btnSubmit: false });
    }
  }

  handleType(type) {
    this.setState({ ...this.state, type });
  }

  handleClickSave() {
    const self = this;
    if (self.state.btnSubmit && self.state.type) {
      (async function fetchData() {
        try {
          await api({
            method: 'POST',
            url: '/account/userfeedback/add',
            data: {
              type: self.state.type,
              content: self.state.content,
            },
          });
          self.setState({
            ...self.state,
            saveErrMsg: self.context.intl.messages['app.feedback.saveSuccessMsg'],
            saveResType: 'success',
            isSaveAlertOpen: true,
            isClearInput: true,
          });
        } catch (err) {
          let message = err.message;
          if (err.response.data && err.response.data.message) {
            message = err.response.data.message;
          }
          self.setState({
            ...self.state,
            saveErrMsg: message || self.context.intl.messages['app.feedback.saveErrMsg'],
            saveResType: 'error',
            isSaveAlertOpen: true,
          });
        }
      }());
    }
  }

  // 错误消息alert关闭
  closeSaveAlert() {
    const input = this.state.isClearInput ? { type: null, content: '' } : {};
    this.setState({
      ...this.state,
      btnSubmit: false,
      isSaveAlertOpen: false,
      isClearInput: false,
      ...input,
    });
  }

  render() {
    const self = this;
    const imgType = 'error';

    const types = [
      {
        name: <FormattedMessage id="app.feedback.type1" />,
        type: 'course',
      },
      {
        name: <FormattedMessage id="app.feedback.type2" />,
        type: 'company',
      },
      {
        name: <FormattedMessage id="app.feedback.type3" />,
        type: 'other',
      },
    ];

    const btnClass = classnames({
      'feedback-btn': true,
      disable: !(self.state.btnSubmit && self.state.type),
    });

    return (
      <div>
        <DxHeader />
        <SubNav title={this.context.intl.messages['app.feedback.title']} />
        <div className="feedback-wrapper dx-container">
          <div className="feedback">
            <div className="feedback-select">
              <p><FormattedMessage id="app.feedback.select" /></p>
              <ul>
                {types.map((item, index) => {
                  const typeClass = self.state.type === item.type ? 'active' : '';
                  return (
                    <li
                      key={index}
                      className={typeClass}
                      onClick={() => self.handleType(item.type)}
                    >
                      {item.name}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="feedback-text">
              <p><FormattedMessage id="app.feedback.yours" /></p>
              <div className="textarea-control">
                <textarea
                  placeholder={this.context.intl.messages['app.feedback.input']}
                  onChange={this.handlerChangeContext} value={this.state.content}
                />
                <div className={btnClass}>
                  <button type="button" className="btn-submit" onClick={this.handleClickSave}>
                    <FormattedMessage id="app.feedback.submit" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DxFooter />
        <Toast
          isShow={this.state.isSaveAlertOpen}
          imgType={this.state.saveResType}
          timeout={3000}
          onRequestClose={this.closeSaveAlert}
        >
          <span>{this.state.saveErrMsg}</span>
        </Toast>
      </div>
    );
  }
}
Feedback.contextTypes = contextTypes;
export default Feedback;
