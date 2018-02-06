import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

class Info extends React.Component {
  constructor() {
    super();
    this.state = {
      isFold: false,
      isShowFold:false,
    };
  }


  componentDidMount() {
    const height = this.infoBox.clientHeight;
    const scrollHeight = this.infoBox.scrollHeight;

    if (height >= scrollHeight) {
      this.state.isShowFold = false;
      if (this.unfold) this.unfold.className = "hidden";
    }
    else {
      this.state.isShowFold = true;
    }
  }

  render() {
    const self = this;
    const props = this.props;
    const foldClick = function foldClick(event) {
      if (self.state.isFold) {
        self.setState({ isFold: false });
        self.infoBox.className = "desc unshowall";
      }
      else {
        self.setState({ isFold: true });
        self.infoBox.className = "desc ";
      }
    }
    const getFolder = function getFolderDiv() {
      let divEle = '';
      if (!self.state.isFold) {
        divEle = (
          // 展开
          <div
            className="unfold"
            ref={(ref) => {
              self.unfold = ref;
            }}
            onClick={foldClick}
          >
            <FormattedMessage {...messages.unfold} /></div>
        );

      } else {
        // 折叠
        divEle = (
          <div
            className="unfold"
            ref={(ref) => {
              self.fold = ref;
            }}
            onClick={foldClick}
          ><FormattedMessage {...messages.fold} />
          </div>
        );
      }
      return divEle;
    }

   const getKeywords=function getKeywords(){
      if(props.labels.length>0){
        return(
        <div className="keyword threeline">
          <FormattedMessage {...messages.keyword} />:
          {
            props.labels.map(item => (
              <span key={item.name}>{item.name}</span>
            ))
          }
        </div>
        );
      }
      else
        return ''
    }

    return (
      <div className="info-section">
        <div className="course-title">
          {props.name}
        </div>
        {
          getKeywords()

        }


        <div
          className="desc unshowall"
          ref={(ref) => {
            self.infoBox = ref;
          }}
        >
          {props.desc}
        </div>
        { getFolder()}

      </div>
    );
  }
}

Info.propTypes = {
  name: React.PropTypes.string,
  course_obj: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string,
    id: React.PropTypes.number,
  })),
  labels: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string,
    id: React.PropTypes.number,
  })),
  desc: React.PropTypes.string,
};

export default Info;
