import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import ImageViewer from '../imageviewer';

import messages from './messages';

const propTypes = {
  data: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['show', 'handle']).isRequired,
  handle: PropTypes.func,
  showAnalysis: PropTypes.bool,
};

const defaultProps = {
  showAnalysis: false,
  type: 'show',
  data: {},
  handle() { },
};

class Exercise extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.handleImgClick = this.handleImgClick.bind(this);
    this.hiddenImageViewerClick = this.hiddenImageViewerClick.bind(this);
    this.chooseAnswerIds = [];
    this.upperAlpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    this.rightAnswer = [];
    this.isClick = false;
    this.state = {
      answers: this.props.data.answer,
      chooseAnswerIds: this.chooseAnswerIds,
      showImg: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.rightAnswer = [];
    this.chooseAnswerIds = nextProps.data.chooseAnswerIds || [];
    this.setState({
      answers: nextProps.data.answer,
      chooseAnswerIds: this.chooseAnswerIds,
    });
  }

  handleClick(id, event) {
    const { data, handle } = this.props;

    if (data.type !== 'multi') {
      this.chooseAnswerIds = [id];
    } else {
      const index = this.chooseAnswerIds.indexOf(id);
      if (index !== -1) {
        this.chooseAnswerIds.splice(index, 1);
      } else {
        this.chooseAnswerIds.push(id);
      }
    }

    handle(this.chooseAnswerIds);
    this.setState(Object.assign({}, this.state, { chooseAnswerIds: this.chooseAnswerIds }));
    event.stopPropagation();
    event.preventDefault();
  }

  handleImgClick(img, event) {
    this.img = img;
    this.setState(Object.assign({}, this.state, { showImg: true }));
    event.stopPropagation();
    event.preventDefault();
  }

  hiddenImageViewerClick() {
    this.setState(Object.assign({}, this.state, { showImg: false }));
  }

  render() {
    this.rightAnswer = [];
    const { data, type, showAnalysis } = this.props;
    const { answers, chooseAnswerIds, showImg } = this.state;
    const { content, analysis, score, imgs } = data;
    const exerciseType = data.type;
    const isRight = data.answer_is_right;
    const userAnswerId = data.user_answer_id || this.chooseAnswerIds || [];
    const answerRight = data.answer_right || [];

    const zhTypeClass = classnames({
      'exercise-type': true,
      single: exerciseType === 'single',
      multi: exerciseType === 'multi',
      judge: exerciseType === 'judge',
    });

    const enTypeClass = classnames({
      'exercise-type': true,
      'en-single': exerciseType === 'single',
      'en-multi': exerciseType === 'multi',
      'en-judge': exerciseType === 'judge',
    });

    if (showImg) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return (
      <div className="exercise">
        <div className="exercise-body">
          <div className="exercise-content">
            <FormattedMessage {...messages.type} values={{ enType: <i className={enTypeClass} />, zhType: <i className={zhTypeClass} /> }} /><span className="content">{content}（{score}<FormattedMessage {...messages.unit} />）</span>
            { imgs &&
              <ul className="exercise-img-content"> {
                imgs.map(img => (
                  <li onClick={event => this.handleImgClick(img, event)} key={img.id || img.file_id} className="exercise-img" style={{ background: `url(${img.img_url}) no-repeat`, backgroundSize: 'cover' }} />
                ))
              }
              </ul>
            }
          </div>
          <ul className="exercise-answer">
            {
              answers.map((answer, index) => {
                const cloneAnswer = answer;

                if (cloneAnswer.is_right) {
                  this.rightAnswer.push(index);
                } else if (answerRight.length) {
                  for (let i = 0, length = answerRight.length; i < length; i += 1) {
                    if (answerRight[i].is_right === 1 && cloneAnswer.id === answerRight[i].id) {
                      this.rightAnswer.push(index);
                    }
                  }
                }

                let itemClass;
                if (type === 'show') {
                  if (answerRight.length) {
                    itemClass = classnames({
                      'exercise-answer-item': true,
                      active: userAnswerId.indexOf(cloneAnswer.id) !== -1,
                    });
                  } else {
                    itemClass = classnames({
                      'exercise-answer-item': true,
                      choose: !isRight && userAnswerId.indexOf(cloneAnswer.id) !== -1,
                      active: isRight && userAnswerId.indexOf(cloneAnswer.id) !== -1,
                    });
                  }

                  return (
                    <li key={cloneAnswer.id} className={itemClass}>
                      <span className="exercise-answer-item-content">{this.upperAlpha[index]}. {cloneAnswer.content}</span>
                      { cloneAnswer.imgs &&
                        <ul className="exercise-answer-img"> {
                          cloneAnswer.imgs.map(img => (
                            <li onClick={event => this.handleImgClick(img, event)} key={img.id} className="exercise-img" style={{ background: `url(${img.img_url}) no-repeat`, backgroundSize: 'cover' }} />
                          ))
                        }
                        </ul>
                      }
                    </li>
                  );
                }
                if (chooseAnswerIds.indexOf(cloneAnswer.id) !== -1) {
                  cloneAnswer.active = true;
                } else {
                  cloneAnswer.active = false;
                }
                itemClass = classnames({
                  'exercise-answer-item': true,
                  active: cloneAnswer.active,
                });
                return (
                  <li
                    key={cloneAnswer.id}
                    className={itemClass}
                    onClick={event => this.handleClick(cloneAnswer.id, event)}
                  >
                    <span className="exercise-answer-item-content">{this.upperAlpha[index]}. {cloneAnswer.content}</span>
                    { cloneAnswer.imgs &&
                      <ul className="exercise-answer-img"> {
                        cloneAnswer.imgs.map(img => (
                          <li onClick={event => this.handleImgClick(img, event)} key={img.id} className="exercise-img" style={{ background: `url(${img.img_url}) no-repeat`, backgroundSize: 'cover' }} />
                        ))
                      }
                      </ul>
                    }
                  </li>
                );
              })
            }
          </ul>
        </div>
        {
          showAnalysis && (
            <div className="exercise-analysis">
              <div className="analysis-title"><FormattedMessage {...messages.analysis} /></div>
              <p className="analysis-content">{analysis.content}</p>
              <div className="analysis-answer"><FormattedMessage {...messages.answer} />：{this.rightAnswer.map(value => this.upperAlpha[value]).join('')}</div>
              { analysis.imgs &&
                <ul className="exercise-analysis-img"> {
                  analysis.imgs.map(img => (
                    <li onClick={event => this.handleImgClick(img, event)} key={img.id} className="exercise-img" style={{ background: `url(${img.img_url}) no-repeat`, backgroundSize: 'cover' }} />
                  ))
                }
                </ul>
              }
            </div>
          )
        }
        {
          showImg && (
            <div className="exercise-image-viewer" onClick={this.hiddenImageViewerClick}>
              <ImageViewer imageUrl={this.img.img_url} />
            </div>
          )
        }
      </div>
    );
  }
}

Exercise.propTypes = propTypes;
Exercise.defaultProps = defaultProps;

export default Exercise;
