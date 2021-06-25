import React, { Component } from 'react';
import List from 'antd/lib/list';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { connect } from 'react-redux';
import _slice from 'lodash/slice';
import { instance as axios } from '../../utils/initialize';
import style from './style.scss';
import KonyLoader from '../KonyLoader';
import KonyGravatar from '../KonyGravatar';
import AskQuestion from './AskQuestion';
import { basecampURL } from '../../config/settings';

class KonySupport extends Component {
  state = {
    data: {},
    loading: false,
    refresh: false,
  }

  async componentDidMount() {
    const title = this.props.title;
    if (title) {
      await this.getSupport(title);
    }
  }

  getSupport = async (title) => {
    const data = new FormData();
    data.append('topic', title);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    this.setState({ loading: true }, () => {
      axios({
        method: 'post',
        url: 'api/v1_0/marketplace/support/get/feed-item',
        data,
        marketplace: {
          headers,
        },
      })
        .then((response) => {
          this.setState({
            data: response.data,
            loading: false,
          });
        })
        .catch((error) => {
          this.error(error);
        });
    });
  };

  getTitleUrl = (title, id) => {
    const titleUrl = title.replace(/\s+/g, '-').toLowerCase();
    return `${basecampURL}/s/question/${id}/${titleUrl}`;
  }

  error = (content) => {
    this.setState({
      loading: false,
    });
    Modal.error({
      title: 'Unable to Get Questions',
      content,
    });
  }

  convertTime = (date) => {
    const dateArray = date.split(' ')[0].split('-');
    const monthName = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${monthName[Number(dateArray[1]) - 1]} ${dateArray[2]}, ${dateArray[0]}`;
  }

  askQuestion = (e) => {
    e.preventDefault();
    document.getElementById('askQuestionButton').click();
  }

  showQuestions = details => (
    _slice(details, 0, 5).map((item, i) => (
      <List.Item className={style.postItem} key={i}>
        <List.Item.Meta
          avatar={<KonyGravatar src={`${basecampURL}/${item.createdByPhoto}`} />}
          title={<a href={this.getTitleUrl(item.title, item.questionId)} target="_blank">{item.title}</a>}
          description={(
            <React.Fragment>
              <ul className={style.authorDetail}>
                <li>{item.createdByName}</li>
                <li>{this.convertTime(item.createdTime)}</li>
              </ul>
              <p className={style.body}>
                <div dangerouslySetInnerHTML={{__html: item.body}} />
              </p>
            </React.Fragment>
          )}
        />
      </List.Item>
    ))
  );

  refreshScreen = () => {
    this.setState({ refresh: !this.state.refresh });
    if (process.browser) window.location.reload();
  }

  emptyResults = () => {
    if (this.props.marketplace.isVizApp) {
      return (
        <div className={`${style.firstQuestion} ${style.viz}`}>
          No Results Found.
        </div>
      );
    }
    return (
      <div className={style.emptyResultsWrapper}>
        <div className={style.firstQuestion}>
          Be the first to ask a question.
        </div>
        <AskQuestion
          itemTitle={this.props.title}
          refreshScreen={this.refreshScreen}
          url={this.props.url}
        />
      </div>
    );
  }

  renderContent = details => (
    <Row className={`${style.supportWrapper} ${typeof details !== 'undefined' && details.length > 0 ? '' : style.noResults}`}>
      {
        typeof details !== 'undefined' && details.length > 0 ? (
          <Col span={24}>
            <AskQuestion
              itemTitle={this.props.title}
              refreshScreen={this.refreshScreen}
              url={this.props.url}
            />
          </Col>
        ): ''
      }
      <Col span={24}>
        <List itemLayout="horizontal">
          {typeof details !== 'undefined' && details.length > 0 ? this.showQuestions(details) : this.emptyResults()}
        </List>
      </Col>
      <Col span={24}>
        {!this.props.marketplace.isVizApp && details && details.length > 0 ? (
          <Button
            type="primary"
            id="viewMore"
            className={`${style.postButton} ${style.viewMoreBtn} ${typeof details !== 'undefined' && details.length > 5 ? '' : style.hide}`}
          >
            <a href={`${basecampURL}/s/topic/${details[0].topicId}`}>View More</a>
          </Button>
        ) : null}
      </Col>
    </Row>
  );

  render() {
    return (
      <div className={style.loaderContainer}>
        {this.state.loading ? <KonyLoader inline /> : this.renderContent(this.state.data.questions)}
      </div>
    );
  }
}

KonySupport.propTypes = {
};

KonySupport.defaultProps = {
};

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(KonySupport);
