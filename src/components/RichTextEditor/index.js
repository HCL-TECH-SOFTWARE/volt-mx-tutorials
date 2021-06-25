import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style.scss';

class RichTextEditor extends Component {
  getEditor = () => {
    if (document) {
      const ReactQuill = require("react-quill");
      let Inline = ReactQuill.Quill.import('blots/inline');

      class BoldBlot extends Inline { }
      BoldBlot.blotName = 'bold';
      BoldBlot.tagName = 'b';
      ReactQuill.Quill.register('formats/bold', BoldBlot);

      class CodeBlot extends Inline { }
      CodeBlot.blotName = 'code-block';
      CodeBlot.tagName = 'code';
      ReactQuill.Quill.register('formats/code-block', CodeBlot);

      class italicBlot extends Inline { }
      italicBlot.blotName = 'italic';
      italicBlot.tagName = 'i';
      ReactQuill.Quill.register('formats/italic', italicBlot);

      return (
        <ReactQuill
          onChange={this.props.onChange}
          className={this.props.className}
          modules={this.props.modules}
          formats={this.props.formats}
          placeholder={this.props.placeholder}
        />
      );
    }
    return <TextArea rows={4} />;
  };

  render() {
    return this.getEditor();
  }
}

RichTextEditor.propTypes = {
  modules: PropTypes.object,
  formats: PropTypes.array,
  className: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

RichTextEditor.defaultProps = {
  modules: {},
  formats: [],
  className: "",
  placeholder: "",
  onChange: () => {},
};

export default RichTextEditor;
