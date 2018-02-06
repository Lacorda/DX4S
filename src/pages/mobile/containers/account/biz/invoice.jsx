// 发票申请页面
import React, { Component, PropTypes } from 'react';
import { nav } from 'utils/dx';

class Invoice extends Component {
  static contextTypes = { intl: PropTypes.object } // set i18n
  constructor(...args) {
    super(...args);
    // init handle event
    this.setTitle = ::this.setTitle;
  }
  // set app title
  setTitle() { nav.setTitle({ title: this.context.intl.messages['app.a4biz.inTitle'] }); }
  render() {
    this.setTitle();
    return (
      <div className="invoice">
        <h3>发票开具说明：</h3>
        <p>
          在多学平台企业课程购课完成后，需要开具企业购课发票，可与多学官方工作人员联系；
          <br />
          目前公司对已购课程可开具的发票类型：培训费、课件服务费；
        </p>
        <ol>
          <li>发票申请申请时需要向工作人员提供企业相关资质信息，方可开取。</li>
          <li>发票开具需要进行企业申请流程，在开票流程中望您等待；</li>
        </ol>
        <div>
          联系人:刘明刚
          <br />
          联系电话：18609243987
          <br />
          联系电话：010-57071831
        </div>
      </div>
    );
  }
}

export default Invoice;
