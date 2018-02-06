import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hasMallModuleSelector } from 'dxSelectors/account-user';
import { plans as plansActions } from '../../actions';
import DxHeader from '../../components/header';
import DxFooter from '../../components/footer';
import Card from '../../components/card';
import Loading from '../../components/loading';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import title from './img/plansTitle.png';
import empty from './img/empty.png';

const propTypes = {
  actions: PropTypes.object.isRequired,
  all: PropTypes.array.isRequired,
  required: PropTypes.array.isRequired,
  minors: PropTypes.array.isRequired,
  ownPurchase: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  active: PropTypes.string.isRequired,
  allEnd: PropTypes.bool.isRequired,
  requiredEnd: PropTypes.bool.isRequired,
  electiveEnd: PropTypes.bool.isRequired,
  ownBuyEnd: PropTypes.bool.isRequired,
};

class Plans extends Component {
  constructor(props) {
    super(props);
    this.btnShow = false;
    this.tab = this.tab.bind(this);
    this.outPut = this.outPut.bind(this);
    this.linkTo = this.linkTo.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentWillMount() {
    const { actions } = this.props;
    actions.fetchNew();
  }

  componentDidMount() {
    const { actions, active } = this.props;
    const self = this;
    let fetchPromise = null;
    // 激活tab
    actions.fetchActive('all');
    // 按状态调用数据
    switch (active) {
      case 'all':
        fetchPromise = actions.fetchAllPlans(1, 20);
        break;
      case 'required':
        fetchPromise = actions.fetchRequiredPlans(1, 20);
        break;
      case 'minors':
        fetchPromise = actions.fetchElectivePlans(1, 20);
        break;
      case 'ownPurchase':
        fetchPromise = actions.fetchOwnPurchasePlans(1, 20);
        break;
      default:
        break;
    }
    // 回调
    fetchPromise.then(() => {
      // 重设初始化
      self.initUnfinish = false;
      self.initFinish = true;
    });
  }

  tab(i) {
    const {
      actions, all, required, minors, ownPurchase, allEnd, requiredEnd, electiveEnd, ownBuyEnd, isFetching,
    } = this.props;
    // 判断tab
    actions.fetchActive(i);
    switch (i) {
      case 'all': // 全部
        if (allEnd !== true && isFetching === false) {
          if (all.length < 1) {
            actions.fetchAllPlans(1, 20).then(() => {
              this.initAll = true;
            });
          }
        }
        break;
      case 'required': // 必修
        if (requiredEnd !== true && isFetching === false) {
          if (required.length < 1) {
            actions.fetchRequiredPlans(1, 20).then(() => {
              this.initRequire = true;
            });
          }
        }
        break;
      case 'minors': // 选修
        if (electiveEnd !== true && isFetching === false) {
          if (minors.length < 1) {
            actions.fetchElectivePlans(1, 20).then(() => {
              this.initElective = true;
            });
          }
        }
        break;
      case 'ownPurchase': // 自购
        if (ownBuyEnd !== true && isFetching === false) {
          if (ownPurchase.length < 1) {
            actions.fetchOwnPurchasePlans(1, 20).then(() => {
              this.initOwnBuy = true;
            });
          }
        }
        break;
      default:
        break;
    }
  }

  getData() {
    const { actions, active, allEnd, requiredEnd, electiveEnd, ownBuyEnd, isFetching } = this.props;
    switch (active) {
      case 'all':
        if (allEnd !== true && isFetching === false) {
          actions.fetchAllPlans(0, 20);
        }
        break;
      case 'required':
        if (requiredEnd !== true && isFetching === false) {
          actions.fetchRequiredPlans(0, 20);
        }
        break;
      case 'minors':
        if (electiveEnd !== true && isFetching === false) {
          actions.fetchElectivePlans(0, 20);
        }
        break;
      case 'ownPurchase':
        if (ownBuyEnd !== true && isFetching === false) {
          actions.fetchOwnPurchasePlans(0, 20);
        }
        break;
      default:
        break;
    }
  }

  linkTo(item) {
    const temp = item;
    if (!item.plan) {
      temp.plan = { id: 0 };
    }
    const type = item.item_type || item.type;
    const id = item.item_id || item.id;
    const pid = temp.plan.id;
    switch (type) {
      case 'course':
        return `/plan/${pid}/series/0/courses/${id}`;    // todo 链接修改：跳转到在线课程详情
      case 'solution':
        return `/plan/${pid}/series/${id}`;              // todo 链接修改：跳转到系列课详情
      case 'exam':
        return `/plan/${pid}/series/0/exams/${id}`;      // todo 链接修改：跳转到考试详情
      default:
        return null;
    }
  }

  outPut(data) {
    const { active } = this.props;
    if (data.length !== 0) {
      this.btnShow = true;
      return (
        <div className="listBox">
          {
            data.map((p, i) => (
              <Card
                key={`${i}-${p.item_id}`}
                type={p.item_type}
                img={p.item_img_url}
                name={p.item_name}
                isNew={p.is_new}
                to={this.linkTo(p)}
                done={p.finished}
                task={active === 'all' ? p.task_source : ''}
                style={((i + 1) % 5) ? null : { marginRight: 0 }}
              />
            ))
          }
        </div>
      );
    }
    return (
      <div className="empty">
        <img src={empty} />
        <a><FormattedMessage {...messages.NO} /></a>
      </div>
    );
  }

  render() {
    const {
      all, required, minors, ownPurchase,
      allEnd, requiredEnd, electiveEnd, ownBuyEnd, active, isFetching,
      hasMallModule,
    } = this.props;
    let btn = false;
    const allClass = (active === 'all') ? 'navTab active' : 'navTab';
    const requiredClass = (active === 'required') ? 'navTab active' : 'navTab';
    const minorsClass = (active === 'minors') ? 'navTab active' : 'navTab';
    const ownPurchaseClass = (active === 'ownPurchase') ? 'navTab active' : 'navTab';
    switch (active) {
      case 'all':
        btn = (allEnd === false ? true : false);
        break;
      case 'required':
        btn = (requiredEnd === false ? true : false);
        break;
      case 'minors':
        btn = (electiveEnd === false ? true : false);
        break;
      case 'ownPurchase':
        btn = (ownBuyEnd === false ? true : false);
        break;
      default:
        btn = false;
        break;
    }
    return (
      <div>
        <Loading
          isShow={isFetching}
        />
        <DxHeader />
        <div className="navList">
          <div className="nav">
            <div className="navTitle">
              <img src={title} alt="多学" />
              <p><FormattedMessage {...messages.myLearn} /></p>
            </div>
            <div className={allClass} onClick={() => this.tab('all')}><FormattedMessage {...messages.all} /></div>
            <div className={requiredClass} onClick={() => this.tab('required')}><FormattedMessage {...messages.required} /></div>
            <div className={minorsClass} onClick={() => this.tab('minors')}><FormattedMessage {...messages.minors} /></div>
            {hasMallModule && <div className={ownPurchaseClass} onClick={() => this.tab('ownPurchase')}><FormattedMessage {...messages.ownPurchase} /></div>}
          </div>
        </div>
        {active === 'all' ? this.outPut(all) : (active === 'required' ? this.outPut(required) :
            (active === 'minors' ? this.outPut(minors) : this.outPut(ownPurchase)))}
        <div className="clickMore">
          {this.btnShow ? btn ? <div className="clickMoreBtn" onClick={this.getData}>
                <FormattedMessage {...messages.more} /></div> :
              <div className="clickMoreBtn"><FormattedMessage {...messages.noMore} /></div> : ''}
        </div>
        <DxFooter />
      </div>
    );
  }
}

Plans.propTypes = propTypes;

export default connect(state => ({
  all: state.plans.all || [],
  required: state.plans.required || [],
  minors: state.plans.minors || [],
  ownPurchase: state.plans.ownPurchase || [],
  isFetching: state.plans.isFetching || false,
  active: state.plans.active || 'all',
  allEnd: state.plans.allEnd || false,
  requiredEnd: state.plans.requiredEnd || false,
  electiveEnd: state.plans.electiveEnd || false,
  ownBuyEnd: state.plans.ownBuyEnd || false,
  hasMallModule: hasMallModuleSelector(state),
}), dispatch => ({
    actions: bindActionCreators(plansActions, dispatch),
  }
))(Plans);

