import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import { findPropEq } from 'utils/fn';
import { setTitle } from 'utils/dx/nav';
import {
  fetchRequiredCourse,
  appendRequireCourse,
  selectRequiredCourse,
  unselectRequiredCourse,
} from 'dxActions/distribution-required';

import Course from './course';
import Selected from './selected';
import Search from '../../../components/search';
import RefreshLoad from '../../../components/refreshload';
import EmptyContent from './empty-content';
import messages from '../messages';

import {
  coursesSelector,
  selectedCoursesLengthSelector,
  selectedCoursesSelector,
} from './selectors';

import './selection-course.styl';

class RequiredDistribution extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      hasMoreData: false,
      params: {
        index: 1,
        name: '',
        source: '',
        initialized: false,
      },
    };
    this.getIntl = ::this.getIntl;
    this.publish = ::this.publish;
    this.toggleSelectedList = ::this.toggleSelectedList;
    this.closeSelectedBox = ::this.closeSelectedBox;
    this.paginateData = ::this.paginateData;
  }

  async componentDidMount() {
    setTitle({ title: this.getIntl('title') });
    await this.fetchData();
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ initialized: true });
  }

  getIntl(id) {
    return this.context.intl.messages[`app.distribution.course.${id}`];
  }

  getQuery() {
    return [
      {
        title: this.getIntl('from'),
        nav: [
          { id: '', name: this.getIntl('from.all') },
          { id: 'enterprise', name: this.getIntl('from.enterprise') },
          { id: 'mall', name: this.getIntl('from.mall') },
        ],
      },
    ];
  }

  async fetchData(params = {}, cb) {
    const paramsState = this.state.params;
    await new Promise(resolve => this.setState({ params: { ...paramsState, ...params } }, resolve));
    const courses = await this.props.fetchRequiredCourse(this.state.params);
    await this.controlPullUp(courses.length);
    if (cb) cb();
    else if (this.listBox) this.listBox.refresh();
    return courses;
  }

  async paginateData(cb) {
    const params = this.state.params;
    await new Promise(resolve =>
      this.setState({ params: { ...params, index: params.index + 1 } }, resolve)
    );
    const courses = await this.props.appendRequireCourse(this.state.params);
    await this.controlPullUp(courses.length);
    cb();
  }

  async controlPullUp(length) {
    const hasMoreData = length >= 10;
    return await new Promise(resolve => this.setState({ hasMoreData }, resolve));
  }

  publish() {
    if (this.props.selectedCourses.length) {
      this.context.router.push('/distribution/required/new/selection-user');
    }
  }

  closeSelectedBox() {
    this.setState({ isOpen: false }, () => {
      this.listBox.refresh();
    });
  }

  toggleSelectedList() {
    const isOpen = this.state.isOpen;
    this.setState({ isOpen: !isOpen });
  }

  render() {
    const {
      courses,
      length,
      selectedCourses,
      selectRequiredCourse: onSelect,
      unselectRequiredCourse: onUnselect,
    } = this.props;

    const params = this.state.params;
    const nextStepClass = classnames(
      'dx-footer-operation',
      { 'dx-footer-operation-disabled': !this.props.selectedCourses.length },
    );
    let listEl;
    if (courses.length) {
      listEl = (
        <RefreshLoad
          absolute
          className="distribution-course-list"
          needPullDown
          needPullUp={this.state.hasMoreData}
          pullDownCallBack={cb => this.fetchData({ index: 1 }, cb)}
          pullUpCallBack={this.paginateData}
          ref={(ref) => { this.listBox = ref; }}
        >
          <ul className="dx-list">
            { courses.map(course =>
              (<Course
                key={course.id}
                readOnly={course.available_num === 0}
                {...course}
                type={course.course_type}
                selected={!!findPropEq('id', course.id, selectedCourses)}
                onChecked={onSelect}
                onUnchecked={onUnselect}
              />))
            }
          </ul>
        </RefreshLoad>
      );
    } else {
      listEl = <EmptyContent whole={!this.state.initialized} />;
    }
    return (
      <div className="full-fill distribution-required">
        <Search
          query={this.getQuery()}
          defaultFilter={[params.source]}
          placeholder={this.getIntl('search')}
          buttonText={this.getIntl('confirm')}
          onQuery={({ search: name, filter }) =>
            this.fetchData({ name, source: filter[0], index: 1 }, null)}
        />
        {listEl}
        <div className="dx-footer">
          <div
            className={`dx-footer-desc${!this.state.isOpen ? ' active' : ''}`}
            onClick={this.toggleSelectedList}
          >
            <span className="dx-icon-triangle">
              <FormattedMessage {...messages.selectedCourse} values={{ num: `${length}` }} />
            </span>
          </div>
          <div className={nextStepClass} onClick={this.publish}>
            <FormattedMessage {...messages.nextStep} />
          </div>
        </div>
        <Selected
          onClose={this.closeSelectedBox}
          isOpen={this.state.isOpen}
          onRemove={onUnselect}
          items={selectedCourses}
        />

      </div>
    );
  }
}

const { arrayOf, object, number, func } = PropTypes;
RequiredDistribution.contextTypes = {
  intl: object,
  router: object,
};

RequiredDistribution.propTypes = {
  courses: arrayOf(object),
  length: number,
  selectedCourses: arrayOf(object),

  // actions
  fetchRequiredCourse: func,
  appendRequireCourse: func,
  selectRequiredCourse: func,
  unselectRequiredCourse: func,
};

const mapStateToProps = state => ({
  courses: coursesSelector(state),
  selectedCourses: selectedCoursesSelector(state),
  length: selectedCoursesLengthSelector(state),
});

const mapDispatchToProps = {
  fetchRequiredCourse,
  appendRequireCourse,
  selectRequiredCourse,
  unselectRequiredCourse,
};

export default connect(mapStateToProps, mapDispatchToProps)(RequiredDistribution);
