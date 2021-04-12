import React, { Component } from 'react';
import Modal from 'antd/lib/modal';
import Select from 'antd/lib/select';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import style from './style.scss';
import KonyButton from '../KonyButton';
import RichTextEditor from '../RichTextEditor';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class AskQuestionInner extends Component {
  handleChange = (value) => {
    this.props.form.setFields({"body":{value}});
  };

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'code-block'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  formats = [
    'bold', 'italic', 'underline', 'code-block',
    'list', 'bullet',
    'link',
  ];
  render() {
    const {
      visible, onCancel, onCreate, form,
    } = this.props;
    const { getFieldDecorator } = form;
    const title = this.props.itemTitle;
    return (
      <Modal
        visible={visible}
        okText="Ask"
        onOk={onCreate}
        onCancel={onCancel}
        footer={[
          <KonyButton className={style.filterCancel} title="Cancel" type="action" onClick={onCancel} />,
          <KonyButton title="Ask" type="action" color="blue" onClick={onCreate} />,
        ]}
      >
        <Form layout="vertical" className={style.askForm}>
          <FormItem label="Post to" className={style.postToItem}>
            {
                getFieldDecorator(
                  'contextTopic',
                  {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                    initialValue: 'Marketplace',
                  },
                )(<Select disabled>
                  <Option value="Marketplace">Marketplace</Option>
                  </Select>)
              }
          </FormItem>
          <FormItem label="Question" className={style.quesItem}>
            {
                getFieldDecorator(
                  'title',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Please enter your desired Question!',
                      },
                    ],
                  },
                )(<TextArea rows={4} />)
              }
          </FormItem>
          <FormItem label="Details" className={style.detailsItem}>
            {
              getFieldDecorator(
                'body',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter additional details!',
                    },
                  ],
                },
              )
              (
                <RichTextEditor
                  onChange={this.handleChange}
                  modules={this.modules}
                  formats={this.formats}
                  className={style.quillUI}
                />
              )
            }
          </FormItem>
          <FormItem className={style.topicsItem}>
            {
              getFieldDecorator(
                  'topics',
                  {
                    rules: [{
                      required: true,
                      message: 'Please select related topics!',
                    }],
                    initialValue: title,
                  },
                )(<Select mode="tags" defaultValue={['Component']} tokenSeparators={[';']}>
                  <Option value={title} disabled >{title}</Option>
                  </Select>)
              }
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const AskQuestionForm = Form.create()(AskQuestionInner);
export default AskQuestionForm;
