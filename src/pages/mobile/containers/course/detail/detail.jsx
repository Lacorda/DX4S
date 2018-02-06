import React, { Component, PropTypes } from 'react';
import Rate from 'components/rate';
import  {Link} from 'react-router';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import { Confirm } from 'components/modal';
import Connect from '../../../connect';

class Detail extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isFold: false,
      isConfirmOpen: false,
    };
    this.closeConfirm = ::this.closeConfirm;
    this.handleArrange = ::this.handleArrange;
  }

  componentDidUpdate() {
    const height = this.infoBox.clientHeight;
    const scrollHeight = this.infoBox.scrollHeight;
    if (height >= scrollHeight) {
      this.state.isShowFold = false;
      if (this.unfold) {
        this.unfold.className = 'hidden';
      }
    } else {
      if (this.unfold) {
        this.unfold.className = 'unfold';
      }
    }
  }

  handleArrange() {
    const info = this.props.detail.info;
    const data = {
      plan_id: this.props.params.plan_id,
      course_id: this.props.params.course_id,
      is_arranged: !info.is_arranged,
    };
    this.props.actions.arrangeCourse(data).then(() => {
      if (!data.is_arranged) {
        const query = {
          plan_id: this.props.params.plan_id,
          solution_id: this.props.params.solution_id || 0,
          course_id: this.props.params.course_id,
        };
        this.props.actions.fetchAssement(query);
        this.props.actions.fetchChapter(query);
      }
    });
    this.setState({ ...this.state, isConfirmOpen: false });
  }

  closeConfirm() {
    this.setState({ ...this.state, isConfirmOpen: false });
  }

  render() {
    const info = this.props.detail.info;
    const assessment = this.props.course.assessment.info;
    const self = this;
    const foldClick = function foldClick() {
      if (self.state.isFold) {
        self.setState({ isFold: false });
        self.infoBox.className = 'summary unshowall';
      } else {
        self.setState({ isFold: true });
        self.infoBox.className = 'summary';
      }
    };

    const confirmMsgId = info.is_arranged ? 'msgWithdraw' : 'msgEnroll';

    const getFolder = function getFolderDiv() {
      let divEle = '';
      if (!self.state.isFold) {
        divEle = (
          <div className="unfold" ref={(ref) => { self.unfold = ref; }} onClick={foldClick} ><FormattedMessage id="app.course.more" /></div>
        );
      } else {
        divEle = (
          <div className="unfold" ref={(ref) => { self.fold = ref; }} onClick={foldClick} ><FormattedMessage id="app.course.hide" /></div>
        );
      }
      return divEle;
    };

    const setRange = function() {
      if (!info.is_elective) {
        return null;
      }

      if (assessment.pass_state === 2) {
        return null;
      }

      if (info.is_arranged) {
        return <a className="opt opt-withdraw" onClick={()=>{ self.setState({ ...self.state, isConfirmOpen: true }); }} ><FormattedMessage id="app.course.withdraw" /></a>;
      }
      return <a className="opt opt-enroll" onClick={()=>{ self.setState({ ...self.state, isConfirmOpen: true }); }} ><FormattedMessage id="app.course.enroll" /></a>;
    };

    return (
      <div className="description">
        <Confirm
          shouldCloseOnOverlayClick={false}
          isOpen={this.state.isConfirmOpen}
          onRequestClose={this.closeConfirm}
          onConfirm={this.handleArrange}
          confirmButton={<span><FormattedMessage id="app.course.ok" /></span>}
          cancelButton={<span><FormattedMessage id="app.course.cancel" /></span>}
        >
          <span>
            <FormattedMessage
              {...messages[confirmMsgId]}
            />
          </span>
        </Confirm>

        <div className="title">
          <p className="title-info">{info.course_name}</p>
          {setRange()}
        </div>

        <div className="keyword">
          <span className="caption"><FormattedMessage id="app.course.keywords" />:</span>
          {
            info.labels.map((label, index) => {
              return (
                <span className="tag" key={index}>{label.name}</span>
              );
            })
          }
        </div>
        <div className="line">
          <span className="caption"><FormattedMessage id="app.course.lecture" />:</span>
          <span className="lecture">{info.lecturer_name}</span>
        </div>
        <div className="rate-line">
          <span className="caption"><FormattedMessage id="app.course.ratings" />:</span>
          <Rate score={info.star_level} />
        </div>
        <div className="summary unshowall" ref={(ref) => { self.infoBox = ref; }} dangerouslySetInnerHTML={{__html: info.course_info}}>
        </div>
        { getFolder()}
        {
          (() => {
            if (assessment.read_state < 7) {
              return null;
            }
            return (
              <div className={`signet ${assessment.read_state === 7 ? 'pass' : 'fail'}`}>
              </div>
            );
          })()
        }
      </div>
    );
  }
}

// export default Detail;
export default Connect(Detail);
