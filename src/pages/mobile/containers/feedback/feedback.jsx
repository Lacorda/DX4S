import React, { Component, PropTypes } from 'react';
import api from 'utils/api';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import { nav } from 'utils/dx';
import Button from '../../../../components/button';
import { Alert, Toast } from '../../../../components/modal/index';
const contextTypes = {
  intl: React.PropTypes.object.isRequired,
};
class Feedback extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      btnSubmit: false,
      isSaveAlertOpen: false,
      isClearInput: false,
      saveErrMsg: '',
      type: null,
      content: '',
    };

    this.setNavBar = ::this.setNavBar;
    this.handlerChangeContext = ::this.handlerChangeContext;
    this.handleClickSave = ::this.handleClickSave;
    this.handleTpye = ::this.handleTpye;
    this.closeSavaAlert = ::this.closeSavaAlert;
  }

  static contextTypes = {
    intl: PropTypes.object,
  }

  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.feedback.title'],
    });
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

  handleTpye(type) {
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
          self.setState({ ...self.state, saveErrMsg: self.context.intl.messages['app.feedback.saveSuccessMsg'], isSaveAlertOpen: true, isClearInput: true });
        } catch (err) {
          let message = err.message;
          if (err.response.data && err.response.data.message) {
            message = err.response.data.message;
          }
          self.setState({ ...self.state, saveErrMsg: message || self.context.intl.messages['app.feedback.saveErrMsg'], isSaveAlertOpen: true });
        }
      }());
    }
  }

  // 错误消息alert关闭
  closeSavaAlert() {
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
    this.setNavBar();
    const self = this;

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
      'c-btn': true,
      disable: !(self.state.btnSubmit && self.state.type),
    });

    return (
      <div className="feedback">
        <p><FormattedMessage id="app.feedback.select" /></p>
        <ul className="fd-type">
          {types.map((item, index) => {
            const typeClass = self.state.type === item.type ? 'active' : '';
            return (
              <li
                key={index}
                className={typeClass}
                onClick={() => self.handleTpye(item.type)}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
        <p><FormattedMessage id="app.feedback.yours" /></p>
        <div className="c-textarea">
          <textarea className="textarea-contral" placeholder={this.context.intl.messages['app.feedback.input']} onChange={this.handlerChangeContext} value={this.state.content} />
        </div>
        <div className={btnClass}>
          <Button type="primary" onClick={this.handleClickSave}><FormattedMessage id="app.comment.submit" /></Button>
        </div>
        <Toast
          isOpen={this.state.isSaveAlertOpen}
          timeout={3000}
          onRequestClose={this.closeSavaAlert}
        >
          <span>{this.state.saveErrMsg}</span>
        </Toast>
      </div>
    );
  }
}
Feedback.contextTypes = contextTypes;
export default Feedback;
