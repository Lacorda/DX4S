import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { nav } from 'utils/dx';

import messages from './messages';

class Help extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showAnswerIndex: null,
    };
    this.setNavBar = ::this.setNavBar;
    this.handleMore = ::this.handleMore;
  }

  setNavBar() {
    nav.setTitle({
      title: '使用帮助',
    });
  }

  handleMore(showAnswerIndex) {
    this.setState({ showAnswerIndex });
  }

  render() {
    this.setNavBar();

    const list = [];
    for (let i = 1, l = 7; i <= l; i++) {
      list.push({
        question: messages[`question_${i}`],
        answer: messages[`answer_${i}`],
      });
    }

    return (
      <div className="help">
        {list.map((item, index) => {
          const isShow = this.state.showAnswerIndex === index ? 'block' : 'none';
          return (
            <div key={index}>
              <h2 className="question" onClick={() => this.handleMore(index)} ><FormattedMessage id={item.question.id} /></h2>
              <div className="answers" style={{ display: isShow }}>
                <FormattedHTMLMessage id={item.answer.id} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Help;
