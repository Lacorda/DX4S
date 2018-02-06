import React, { Component } from 'react';


class Manage extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div id="Ding">
        <p className="title">Step1 登录钉钉管理后台</p>
        <p className="instruct">点击“企业应用”，在列表中找到“多学”，鼠标经过点击“进入”，在新窗口自动登录多学管理后台。</p>
        <div className="line"></div>
        <p className="title">Step2 组织和管理培训</p>
        <p className="instruct">在多学管理后台可以便捷地制作试卷、课程、配置学习任务，查看学员学习报表</p>
      </div>
    );
  }
}

export default Manage;

