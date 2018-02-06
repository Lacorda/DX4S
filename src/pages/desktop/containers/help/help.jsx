import React, { Component, PropTypes } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import DxHeader from '../../components/header';
import DxFooter from '../../components/footer';
import SubNav from '../../components/sub-nav';

import messages from './messages';

class Help extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      showAnswerIndex: null,
    };
    this.handleMore = ::this.handleMore;
  }

  handleMore(showAnswerIndex) {
    this.setState({ showAnswerIndex });
  }

  render() {
    const list = [];
    for (let i = 1, l = 7; i <= l; i += 1) {
      list.push({
        question: messages[`question_${i}`],
        answer: messages[`answer_${i}`],
      });
    }

    return (
      <div>
        <DxHeader />
        <SubNav title={this.context.intl.messages['app.help.title']} />
        <div className="help-wrapper dx-container">
          <div className="help">
            <div className="help-list">
              {list.map((item, index) => {
                const isShow = this.state.showAnswerIndex === index ? 'block' : 'none';
                return (
                  <div key={index}>
                    <div className={`help-question ${this.state.showAnswerIndex === index ? 'active' : ''}`}
                         onClick={() => this.handleMore(index)}>
                      <FormattedMessage id={item.question.id} />
                      <div className="icon-arrow">&nbsp;</div>
                    </div>
                    <div className="help-answers" style={{ display: isShow }}>
                      <FormattedHTMLMessage id={item.answer.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <DxFooter />
      </div>
    );
  }
}

export default Help;
