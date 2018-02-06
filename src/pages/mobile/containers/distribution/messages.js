export default {
  // commons
  emptyContent: { id: 'app.distribution.emptyContent', en: 'Not match', zh: '列表为空' },
  enterpriseSource: { id: 'app.distribution.source.enterprise', en: 'Compony', zh: '讲师制作' },
  companySource: { id: 'app.distribution.source.mall', en: 'Duoxue Mall', zh: '多学课堂' },

  // title
  distributedRequiredTitle: { id: 'app.distribution.plan.history', en: 'Published Compulsory Plan', zh: '已发必修' },
  publishRequiredTitle: { id: 'app.distribution.confirm.title', en: 'Compulsory Plan', zh: '必修计划' },
  addCourseTitle: { id: 'app.distribution.course.title', en: 'Add Courses', zh: '添加课程' },
  addUserTitle: { id: 'app.distribution.user.title', en: 'Add Number', zh: '添加人员' },
  detailTitle: { id: 'app.distribution.detail.title', en: 'Compulsory Plan Detail', zh: '必修计划详情' },
  userDetailTitle: { id: 'app.distribution.detail.user.title', en: 'Recipient', zh: '已发人员' },
  courseDetailTitle: { id: 'app.distribution.detail.course.title', en: 'Published Course', zh: '已发课程' },
  planTitle: { id: 'app.distribution.confirm.title', en: 'Compulsory Plan', zh: '必修计划' },

  selectAll: { id: 'app.distribution.selectall', en: 'All', zh: '全选直属' },
  courses: { id: 'app.distribution.coursesCount', en: '{num}', zh: '{num}门' },
  users: {
    id: 'app.distribution.usersCount',
    en: `{num, plural, 
  =null {Turn to backstage management for check}  
  other {#}
}`,
    zh: `{num, plural, 
  =null {请至企业管理后台查看}  
  other {#人}
}`,
  },
  deadline: { id: 'app.distribution.plan.deadline', en: 'End time', zh: '截止时间' },
  course: { id: 'app.distribution.plan.course', en: 'Course', zh: '课程' },
  beginTime: { id: 'app.distribution.plan.beginTime', en: 'Start time', zh: '开始时间' },
  live: { id: 'app.distribution.plan.live', en: 'Course', zh: '直播' },
  remove: { id: 'app.distribution.remove', en: 'Delete', zh: '删除' },
  addPlan: { id: 'app.distribution.plan.addPlan', en: 'Add new Plan', zh: '添加计划' },
  addLive: { id: 'app.distribution.plan.addLive', en: 'Add new Live', zh: '添加直播' },
  searchPlan: { id: 'app.distribution.plan.search', en: 'Search', zh: '搜索：计划名称搜索' },
  source: { id: 'app.distribution.course.source', en: 'From', zh: '来源' },
  available: {
    id: 'app.distribution.course.available',
    en: `Available Number: {num, plural,
    =null {Unlimited}
    other {# people}
    }`,
    zh: `可用人数：{num, plural,
    =null {不限}
    other {# 人}
}`,
  },
  searchCourse: { id: 'app.distribution.course.search', en: 'Search', zh: '搜索：课程名称搜索' },
  seriesType: { id: 'app.distribution.course.seriesType', en: 'Series', zh: '系列' },
  confirmSearch: { id: 'app.distribution.course.confirm', en: 'OK', zh: '确定' },
  selectedCourse: { id: 'app.distribution.course.selectedCourse', en: 'Selected course: {num}', zh: '已选课程： {num}门' },
  selectedUser: { id: 'app.distribution.course.selected', en: 'Number： {num}', zh: '已选人数： {num}人' },
  nextStep: { id: 'app.distribution.course.step', en: 'Next', zh: '下一步' },
  fromSource: { id: 'app.distribution.course.from', en: 'From', zh: '课程来源' },
  viewCourse: { id: 'app.distribution.course.view', en: 'view>', zh: '查看>' },
  all: { id: 'app.distribution.course.from.all', en: 'All', zh: '全部' },
  fromEnterprise: { id: 'app.distribution.course.from.enterprise', en: 'Company', zh: '讲师制作' },
  fromMall: { id: 'app.distribution.course.from.mall', en: 'Mall.91yong', zh: '多学课堂' },
  view: { id: 'app.distribution.user.view', en: 'Check', zh: '查 看' },
  searchUser: { id: 'app.distribution.user.search', en: 'Search', zh: '搜索：员工名称搜索' },
  limitedUserCount: {
    id: 'app.distribution.popup.limited',
    en: 'Don\'t add more than 100 person, if over 100 person please turn to backstage management.',
    zh: '每次选择不可超过100人，超过100人请上企业后台',
  },
  availableUserCount: {
    id: 'app.distribution.user.availableUserCount',
    en: `Available numbers {num, plural,
    =Infinity {Unlimited}
    other {#}
}`,
    zh: `可发放课程人数 {num, plural,
    =Infinity {不限}
    other {#人}
}`,
  },
  requiredPlan: { id: 'app.distribution.confirm.requiredPlan', en: 'Compulsory Plan', zh: '必修课程计划' },
  planName: { id: 'app.distribution.confirm.planName', en: 'Plan Name', zh: '计划标题' },
  startTime: { id: 'app.distribution.confirm.start', en: 'Start Time', zh: '起始时间' },
  endTime: { id: 'app.distribution.confirm.end', en: 'End Time', zh: '终止时间' },
  userCount: { id: 'app.distribution.confirm.user', en: 'Received number', zh: '已发人数' },
  courseCount: { id: 'app.distribution.confirm.course', en: 'Sended courses number', zh: '已发课程' },
  selectedUserCount: { id: 'app.distribution.confirm.selectedUserCount', en: 'Selected Number', zh: '已选人数' },
  selectedCourseCount: { id: 'app.distribution.confirm.selectedCourseCount', en: 'Selected Courses', zh: '已选课程' },
  preStep: { id: 'app.distribution.confirm.preStep', en: 'Previous', zh: '上一步' },
  confirm: { id: 'app.distribution.confirm.confirm', en: 'Publish', zh: '确认发布' },
  publishSuccess: {
    id: 'app.distribution.confirm.publishSuccess',
    en: '{name} Compulsory plan has been published',
    zh: '“{name}”必修计划已下发',
  },
  viewPublish: { id: 'app.distribution.confirm.viewPublish', en: 'Check it', zh: '查看已发计划' },
};
