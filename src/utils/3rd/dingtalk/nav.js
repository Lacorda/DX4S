// https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.cEaCCb&treeId=171&articleId=104928&docType=1
/* global dd */

function setTitle(options) {
  dd.biz.navigation.setTitle({
    title: options.text,
    // onSuccess: () => {},
    // onFail: function(err) {},
  });
}

function setRight(options) {
  const opt = {
    show: options.enable || false,
    control: true,
    text: options.text || '',
  };
  if (options.event) {
    opt.onSuccess = () => {
      options.event();
      return false;
    };
  } else {
    opt.onSuccess = () => false;
  }

  dd.biz.navigation.setRight(Object.assign({}, opt)); // hack ding ding
}

exports.setTitle = setTitle;
exports.setRight = setRight;
