import React from 'react';
import Divider from 'antd/lib/divider';
import PropTypes from 'prop-types';
import style from './style.scss';
import FilterCheckbox from './FilterCheckbox';

const FilterSubPanel = props => {
  if(!props.listOfSelections || props.listOfSelections.length === 0) {
    return null
  }
  return (
  <div className={style.filterSubPanel}>
    <h4 className={style.filterSubTitle}>{props.title}</h4>
    <Divider className={style.divider} />
    { props.listOfSelections.map(item => (<FilterCheckbox
      checked={item.selected}
      title={item.title}
      filter={props.filter}
      key={item.id}
      id={item.id}
      select={props.handleSelect}
    />))}
  </div>
)};

FilterSubPanel.propTypes = {
  title: PropTypes.string,
  listOfSelections: PropTypes.array,
};

FilterSubPanel.defaultProps = {
  title: 'Button',
  listOfSelections: [],
};

export default FilterSubPanel;
