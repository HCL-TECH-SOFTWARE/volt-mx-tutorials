import React, { Component } from 'react';
import Checkbox from 'antd/lib/checkbox';
import PropTypes from 'prop-types';
import style from './style.scss';
import KonyButton from '../../components/KonyButton';

class FilterCheckbox extends Component {
  state = {
    checked: false,
  };

  onChange = (e) => {
    this.setState({
      checked: e.target.checked,
    });
  };

  toggleChecked = (filter, id) => {
    this.setState({ checked: !this.state.checked });
    this.props.select(filter, id);
  };

  render() {
    const { id, checked, filter } = this.props;
    return (
      <span>
        <Checkbox
          checked={checked}
          onChange={this.onChange}
          className={style.hide}
        >
          {this.props.title}
        </Checkbox>
        <KonyButton
          title={this.props.title}
          type="filter"
          className={style.button}
          onClick={() => this.toggleChecked(filter, id)}
          active={checked}
        />
      </span>
    );
  }
}

FilterCheckbox.propTypes = {
  title: PropTypes.string,
};

FilterCheckbox.defaultProps = {
  title: '',
};

export default FilterCheckbox;
