import React, { Component } from 'react';
import Modal from 'antd/lib/modal';
import { connect } from 'react-redux';
import KonyButton from '../KonyButton';
import PostAnIdeaForm from './PostAnIdeaForm';
import KonyLoader from '../KonyLoader';
import { instance as axios } from '../../utils/initialize';
import { basecampURL } from '../../config/settings';

class PostAnIdea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      refresh: false,
    };
  }

  showModal = () => {
    if (this.props.marketplace.isLogin
      || this.props.marketplace.isVizWeb) {
      this.setState({
        visible: true,
      });
    } else {
      window.location.href = `/oauth/login?destination=${
        process.browser ? window.location.href : '/'
      }`;
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  postQuestion = async (values) => {
    const data = new FormData();
    data.append('title', values.title);
    data.append('body', values.description);
    data.append('categories', values.categories);
    data.append('tags', values.tags);

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    this.setState({ loading: true }, () => {
      axios({
        method: 'post',
        url: 'api/v1_0/marketplace/post-idea',
        data,
        config: {
          headers,
        },
      })
        .then(() => {
            this.success();
        })
        .catch((error) => {
          this.error(error.data);
        });
    });
  };

  refreshScreen = () => {
    this.setState({ refresh: !this.state.refresh });
    if (process.browser) window.location.reload();
  };

  handleCreate = () => {
    this.setState({
      loading: true,
      visible: true,
    });
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        this.setState({
          loading: false,
          visible: true,
        });
        return;
      }
      this.postQuestion(values);
      form.setFields({ description: { value: null } });
      form.resetFields();
    });
  };

  success = () => {
    this.setState({
      loading: false,
      visible: false,
    });

    Modal.success({
      className: 'konyModal successModal',
      title: 'Component Proposal Success',
    });
    this.refreshScreen();
  };

  error = (content) => {
    this.setState({
      visible: false,
      loading: false,
    });

    Modal.error({
      title: 'Unable to Propose',
      className: 'konyModal errorModal',
      content,
    });
    this.refreshScreen();
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div className="proposeAComponentButton">
        {this.state.loading ? <div /> : ''}
        <KonyButton
          title="Propose a Component"
          type="action"
          color="blue"
          onClick={e => this.showModal(e)}
        />
        { this.state.loading ? <KonyLoader /> : null }
        <PostAnIdeaForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          itemTitle={this.props.itemTitle}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ marketplace }) => ({ marketplace });

export default connect(mapStateToProps)(PostAnIdea);
