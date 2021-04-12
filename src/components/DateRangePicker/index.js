import DatePicker from 'antd/lib/date-picker';
import React, { Component } from 'react';
import moment from 'moment';
import style from './style.scss';
import initialize from '../../utils/initialize';
import { marketplaceActions } from '../../actions';
import KonyButton from '../KonyButton';

class DateRangePicker extends Component {
  state = {
    value: this.props.defaultDateValuesInMoment,
    open: false,
    dates: this.props.defaultDateValues,
  };

  static async getInitialProps(ctx) {
    await initialize(ctx);
    await ctx.store.dispatch(marketplaceActions.getConfig(true));
  }

  onChange = (date, dateString) => {
    this.setState({ value: date, dates: dateString });
  };

  applyDropdown(e) {
    const { setDate } = this.props;
    const { dates, value } = this.state;
    this.setState({
      open: false,
    });
    setDate(dates, value);
  }

  closeDropdown(e) {
    this.setState({
      open: false,
    });
  }

  disabledDate(current) {
    return current && current > moment().endOf('day');
  }

  render() {
    const { RangePicker } = DatePicker;
    const { open, value } = this.state;

    return (
      <RangePicker
        onChange={this.onChange}
        showToday={false}
        className={style.input}
        open={open}
        format="YYYY-MM-DD"
        value={value}
        onOpenChange={() => this.setState({ open: true })}
        disabledDate={this.disabledDate}
        renderExtraFooter={() => (
          <div className={style.actionWrapper}>
            <KonyButton
              title="Apply"
              type="action"
              color="blue"
              onClick={e => this.applyDropdown(e)}
            />
            <KonyButton
              title="Close"
              type="action"
              color="white"
              className={style.actionButton}
              onClick={e => this.closeDropdown(e)}
            />
          </div>
        )}
      />
    );
  }
}

DateRangePicker.propTypes = {
};

DateRangePicker.defaultProps = {
};

export default DateRangePicker;
