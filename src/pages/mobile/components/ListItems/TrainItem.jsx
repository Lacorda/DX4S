import React from 'react';
import { Link } from 'react-router';
import './TrainItem.styl';

class TrainItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (

      <div className="train_item">
        <div className="img">
          <Link to={this.props.link}><img src={this.props.img_Url} alt={this.props.name} /></Link>
        </div>
        <div className="train_info">
          <Link to={this.props.link}>
            <div className="title-info">{this.props.name}</div>
            <div className="time">任务完成率: {this.props.task_rate}%</div>
            <div className="taskrate">{this.props.icon_text} : {this.props.end_time}</div>
          </Link>
        </div>
      </div>


    );
  }
}
TrainItem.propTypes =
  {
    link: React.PropTypes.string,
    img_Url: React.PropTypes.string,
    name: React.PropTypes.string,
    icon_text: React.PropTypes.string,
    end_time: React.PropTypes.string,
    task_rate: React.PropTypes.number,
  }

export  default  TrainItem;
