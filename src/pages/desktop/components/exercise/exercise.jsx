import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Lightbox from 'react-image-lightbox';

import messages from './messages';

const propTypes = {
  data: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['show', 'handle']).isRequired,
  handle: PropTypes.func,
  showAnalysis: PropTypes.bool,
  NO: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
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
    this.images = [];
    this.state = {
      answers: this.props.data.answer,
      chooseAnswerIds: this.chooseAnswerIds,
      showImg: false,
      photoIndex: 0,
    };
  }

  handleClick(id, event) {
    const { NO, data, handle } = this.props;

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

    handle(NO - 1, this.chooseAnswerIds);
    this.setState({ chooseAnswerIds: this.chooseAnswerIds });
    event.stopPropagation();
    event.preventDefault();
  }

  handleImgClick(img, event) {
    this.setState({
      showImg: true,
      photoIndex: this.images.indexOf(img),
    });
    event.stopPropagation();
    event.preventDefault();
  }

  hiddenImageViewerClick() {
    this.setState({ showImg: false });
  }

  render() {
    this.rightAnswer = [];
    const { data, type, showAnalysis, NO, id } = this.props;
    const { answers, chooseAnswerIds, showImg, photoIndex } = this.state;
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

    this.images = [];

    return (
      <div className="exercise" id={id}>
        <div className="exercise-body">
          <div className="exercise-content">
            <div className="content">
              <span>{`${NO}、`}</span><FormattedMessage {...messages.type} values={{ enType: <i key="enType" className={enTypeClass} />, zhType: <i key="zhType" className={zhTypeClass} /> }} />{content}（{score}<FormattedMessage {...messages.unit} />）
            </div>
            {imgs ?
              <ul className="exercise-img-content"> {
                imgs.map((img) => {
                  this.images.push(img.img_url);
                  return (<li
                    onClick={event => this.handleImgClick(img.img_url, event)}
                    key={img.id || img.file_id}
                    className="exercise-img"
                    style={{ background: `url(${img.img_url}) no-repeat`, backgroundSize: 'cover' }}
                  />);
                })
              }
              </ul> : null
            }
          </div>
          <ul className="exercise-answer">
            {answers.map((answer, index) => {
              if (answer.is_right) {
                this.rightAnswer.push(index);
              } else if (answerRight.length) {
                for (let i = 0, length = answerRight.length; i < length; i += 1) {
                  if (answerRight[i].is_right === 1 && answer.id === answerRight[i].id) {
                    this.rightAnswer.push(index);
                    // eslint-disable-next-line no-param-reassign
                    answer.is_right = 1;
                  }
                }
              }

              let itemClass;
              if (type === 'show') {
                itemClass = classnames({
                  'exercise-answer-item': true,
                  right: isRight && answer.is_right,
                  wrong: !isRight && answer.is_right,
                  active: userAnswerId.indexOf(answer.id) !== -1,
                  multi: data.type === 'multi',
                  noMulti: data.type !== 'multi',
                });

                return (
                  <li key={answer.id} className={itemClass}>
                    <span className="exercise-answer-item-content">{this.upperAlpha[index]}. {answer.content}</span>
                    {answer.imgs ?
                      <ul className="exercise-answer-img"> {
                        answer.imgs.map((img) => {
                          this.images.push(img.img_url);
                          return (<li
                            onClick={event => this.handleImgClick(img.img_url, event)}
                            key={img.id || img.file_id}
                            className="exercise-img"
                            style={{ background: `url(${img.img_url}) no-repeat`, backgroundSize: 'cover' }}
                          />);
                        })
                      }
                      </ul> : null
                    }
                  </li>
                );
              }

              itemClass = classnames({
                'exercise-answer-item': true,
                active: chooseAnswerIds.indexOf(answer.id) !== -1,
                multi: data.type === 'multi',
                noMulti: data.type !== 'multi',
              });
              return (
                <li
                  key={answer.id}
                  className={itemClass}
                  onClick={event => this.handleClick(answer.id, event)}
                >
                  <span className="exercise-answer-item-content">{this.upperAlpha[index]}. {answer.content}</span>
                  {answer.imgs ?
                    <ul className="exercise-answer-img"> {
                      answer.imgs.map((img) => {
                        this.images.push(img.img_url);
                        return (<li
                          onClick={event => this.handleImgClick(img.img_url, event)}
                          key={img.id || img.file_id}
                          className="exercise-img"
                          style={{ background: `url(${img.img_url}) no-repeat`, backgroundSize: 'cover' }}
                        />);
                      })
                    }
                    </ul> : null
                  }
                </li>
              );
            })}
          </ul>
        </div>
        {showAnalysis ?
          <div className="exercise-analysis">
            <div className="analysis-title"><FormattedMessage {...messages.analysis} /></div>
            <p className="analysis-content">{analysis.content}</p>
            <div className="analysis-answer"><FormattedMessage {...messages.answer} />：{this.rightAnswer.map(value => this.upperAlpha[value]).join('')}</div>
            {analysis.imgs ?
              <ul className="exercise-analysis-img">
                {analysis.imgs.map((img) => {
                  this.images.push(img.img_url);
                  return (<li
                    onClick={event => this.handleImgClick(img.img_url, event)}
                    key={img.id || img.file_id}
                    className="exercise-img"
                    style={{ background: `url(${img.img_url}) no-repeat`, backgroundSize: 'cover' }}
                  />);
                })}
              </ul> : null
            }
          </div> : null
        }
        {showImg ?
          <Lightbox
            mainSrc={this.images[photoIndex]}
            nextSrc={this.images[(photoIndex + 1) % this.images.length]}
            prevSrc={this.images[(photoIndex + this.images.length - 1) % this.images.length]}

            onCloseRequest={() => this.setState({ showImg: false })}
            onMovePrevRequest={() => this.setState({
              photoIndex: (photoIndex + this.images.length - 1) % this.images.length,
            })}
            onMoveNextRequest={() => this.setState({
              photoIndex: (photoIndex + 1) % this.images.length,
            })}
          /> : null
        }
      </div>
    );
  }
}

Exercise.propTypes = propTypes;
Exercise.defaultProps = defaultProps;

export default Exercise;
