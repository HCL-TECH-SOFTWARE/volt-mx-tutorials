import React, { Component } from 'react';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { connect } from 'react-redux';
import style from './style.scss';
import AskQuestionForm from './AskQuestionForm';
import { instance as axios } from '../../utils/initialize';
import KonyLoader from '../KonyLoader';
import { basecampURL } from '../../config/settings';
import { replaceAll } from '../../utils';

class AskQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
    };
  }

  showModal = () => {
    if (this.props.marketplace.isLogin || this.props.marketplace.isVizWeb) {
      this.setState({
        visible: true,
      });
    } else {
      window.location.href = `/oauth/login?destination=${process.browser ? window.location.href : '/'}`;
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  postQuestion = async (values) => {
    const data = new FormData();
    data.append('title', values.title);
    data.append('body', replaceAll(values.body, '<br>', '&nbsp;'));
    data.append('contextTopic', values.contextTopic);
    data.append('topics', values.topics);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    this.setState({ loading: true }, () => {
      axios({
        method: 'post',
        url: 'api/v1_0/marketplace/support/post/feed-item',
        data,
        config: {
          headers,
        },
      })
        .then((response) => {
          const feedUrl = response.data.details['feed-url'];
          if (feedUrl) {
            this.success(feedUrl);
          } else {
            this.error(response.data.message);
          }
        })
        .catch((error) => {
          this.error(error.data);
        });
    });
  };

  handleCreate = () => {
    this.setState({
      loading: true,
      visible: true,
    });
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        this.setState({
          loading: false,
          visible: true,
        });
        return;
      }
      this.postQuestion(values);
      form.resetFields();
    });
  };

  success = (feedUrl) => {
    this.props.refreshScreen();
    this.setState({
      loading: false,
      visible: false,
    });
    const url = basecampURL + feedUrl;
    window.open(url, '_blank');
  };

  error = (content) => {
    this.setState({
      visible: false,
      loading: false,
    });

    Modal.error({
      title: 'Unable to Post Question',
      content,
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div>
        {this.state.loading ? <div /> : ''}
        <Button
          type="primary"
          icon="form"
          id="askQuestionButton"
          className={`${style.postButton} ${this.props.marketplace.isVizApp ? style.hide : ''}`}
          onClick={e => this.showModal(e)}
        >
        Ask New Question
        </Button>
        { this.state.loading ? <KonyLoader /> : null }
        <AskQuestionForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          itemTitle={this.props.itemTitle}
        />
      </div>);
  }
}

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(AskQuestion);
