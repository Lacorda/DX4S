import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

import messages from './messages';


class MoreHeader extends React.Component {
  constructor(props) {
    super(props);
    this.handlerLevel1Click = ::this.handlerLevel1Click;
    this.handlerLevel2Click = ::this.handlerLevel2Click;
    this.getFirstLevel = ::this.getFirstLevel;
    this.getSecondLevel = ::this.getSecondLevel;
  }


  componentWillReceiveProps({ currentClassificationId }) {
    if (currentClassificationId !== this.props.currentClassificationId) {
      this.setState({
        currentClassificationId: this.props.currentClassificationId,
      });
    }
  }

  getFirstLevel() {
    const { classificationPosts, currentClassificationId } = this.props;
    if (classificationPosts.length > 1) {
      let hasMatch = false;
      const result = classificationPosts.map((item, index) => {
        let temp;
        if (currentClassificationId == item.id) {
          temp = (
            <span
              key={`level1${index}`}
              onClick={() => this.handlerLevel1Click(item.id)}
              className="active"
            >
              {item.name}
            </span>);
          hasMatch = true;
        }
        else {
          temp = (
            <span
              key={`level1${index}`}
              onClick={() => this.handlerLevel1Click(item.id)}
            >
              {item.name}
            </span>);
        }
        return temp;
      });
      if (hasMatch) {
        return [<span onClick={() => this.handlerLevel1Click('-1')} key="level1All">全部</span>, ...result];
      }
      else {
        return [<span className="active" onClick={() => this.handlerLevel1Click('-1')}
                      key="level1All"
        >全部</span>, ...result];
      }
    }
    return [<span className="active" onClick={() => this.handlerLevel1Click('')} key="level1All">全部</span>];
  }


  getSecondLevel() {

    const { classificationPosts, currentClassificationId, currentPostId } = this.props;
    let posts = [];
    if (classificationPosts.length > 1) {
      if (currentClassificationId > 0) {
        posts = classificationPosts.filter(item => item.id == currentClassificationId);
      }

      if (posts.length > 0 && posts[0].posts.length > 0) {
        let hasMatch = false;
        const result = posts[0].posts.map((item, index) => {
          let temp = null;
          if (item.id == currentPostId) {
            temp = (
              <span
                key={`level2${index}`}
                onClick={() => this.handlerLevel2Click(item.id)}
                className="active"
              >
              {item.name}
              </span>);
            hasMatch = true;
          }
          else {
            temp = (
              <span
                key={`level2${index}`}
                onClick={() => this.handlerLevel2Click(item.id)}
              >
                {item.name}
              </span>);
          }
          return temp;
        });
        if (hasMatch) {
          return [<span onClick={() => this.handlerLevel2Click('')} key="level2all">全部</span>, ...result];
        }
        else {
          return [
            <span
              className="active"
              onClick={() => this.handlerLevel2Click('')}
              key="level2all"
            >
              全部
            </span>,
            ...result,
          ];
        }
      }
    }
    return null;
  }

  handlerLevel1Click(id) {
    this.props.onTagClick(id);
  }

  handlerLevel2Click(postId) {
    this.props.onPostClick(postId);
  }

  render() {
    return (
      <div className="header">
        <div className="firstlevel">
          {
            this.getFirstLevel()
          }
        </div>
        <div className="secondlevel">
          {
            this.getSecondLevel()
          }
        </div>
      </div>
    );
  }
}

MoreHeader.propTypes = {
  classificationPosts: React.PropTypes.arrayOf(React.PropTypes.shape({
  // id: React.PropTypes.number,
  // name: React.PropTypes.string,
  // posts: React.PropTypes.arrayOf(React.PropTypes.shape({
  //   id: React.PropTypes.number,
  //   name: React.PropTypes.string,
  // })),
  })),
  // currentClassificationId: React.PropTypes.number,
  // currentPostId: React.PropTypes.number,
  onTagClick: React.PropTypes.func,
  onPostClick: React.PropTypes.func,
};


// MoreHeader.defaultProps = {};

export default MoreHeader;

