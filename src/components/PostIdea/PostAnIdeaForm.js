import React, { Component } from 'react';
import Modal from 'antd/lib/modal';
import Select from 'antd/lib/select';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import style from './style.scss';
import RichTextEditor from '../RichTextEditor';
import KonyButton from '../KonyButton';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class PostAnIdeaInner extends Component {
  handleChange = (value) => {
    this.props.form.setFields({"description":{ value}})
  }

  render() {
    const {
      visible, onCancel, onCreate, form,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        onOk={onCreate}
        onCancel={onCancel}
        footer={[
          <KonyButton
            className={style.postCancel}
            title="Cancel"
            type="action"
            onClick={onCancel}
          />,
          <KonyButton title="Submit" type="action" color="blue" onClick={onCreate} />,
        ]}
      >
        <Form layout="vertical" className={style.askForm}>
          <FormItem label="Title" className={style.postToItem}>
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: 'Please enter Title.',
                },
              ],
            })(<Input placeholder="Title" />)}
          </FormItem>
          <FormItem label="Category" className={style.postToItem}>
            {
                getFieldDecorator(
                  'categories',
                  {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                    initialValue: 'HCL Volt MX Tutorials',
                  },
                )(<Select disabled>
                  <Option value="HCL Volt MX Tutorials">HCL Volt MX Tutorials</Option>
                  </Select>)
              }
          </FormItem>
          <FormItem label="Tags" className={style.postToItem}>
            {getFieldDecorator('tags', {
              rules: [
                {
                  required: true,
                  message: 'Please add related Tags!',
                },
              ],
            })(
              <Select
                mode="tags"
                placeholder="Type a tag (e.g: programming)"
                notFoundContent="+ Add"
              />,
            )}
          </FormItem>
          <FormItem label="Description" className={style.postToItem}>
            {
              getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter your desired Description!',
                  },
                ],
              })
              (
                <RichTextEditor
                  onChange={this.handleChange}
                  className={style.quillUI}
                  placeholder="Description"
                />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const PostAnIdeaForm = Form.create()(PostAnIdeaInner);
export default PostAnIdeaForm;
