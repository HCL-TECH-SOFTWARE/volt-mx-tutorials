import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import moment from 'moment';
import AnalyticsHeader from '../src/components/AnalyticsHeader';
import { marketplaceActions } from '../src/actions';
import initialize, { instance as axios } from '../src/utils/initialize';
import KonyLayout from '../src/components/KonyLayout';
import DateRangePicker from '../src/components/DateRangePicker';
import KonyLoader from '../src/components/KonyLoader';
import style from './style.scss';
import PageNotFound from '../src/components/PageNotFound';
import KonyButton from '../src/components/KonyButton';
import AnalyticsMiniPanel from '../src/components/AnalyticsMiniPanel';
import AnalyticsPanel from '../src/components/AnalyticsPanel';

class AnalyticsPage extends Component {
  constructor(props) {
    super(props);
    const today = AnalyticsPage.getFormattedDate(new Date());
    const lastWeek = AnalyticsPage
      .getFormattedDate(
        new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      );

    this.state = {
      data: [],
      loading: false,
      dates: [lastWeek, today],
      momentDates: [moment(lastWeek), moment(today)],
    };
    this.setDate = this.setDate.bind(this);
    this.getData = this.getData.bind(this);
  }

  static getFormattedDate(date) {
    const today = date;
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  static async getInitialProps(ctx) {
    await initialize(ctx);
    await ctx.store.dispatch(marketplaceActions.getConfig(true));
  }

  componentDidMount() {
    const { dates } = this.state;
    this.getData(dates);
  }

  getData = async (dates) => {
    try {
      this.setState({ loading: true });
      const res = await axios.get('api/v1_0/marketplace/get_analytics_data_dashboard', {
        params: {
          from_date: dates[0],
          to_date: dates[1],
        },
      });
      this.setState({ loading: false, data: res.data });
    } catch (error) {
      this.setState({ loading: false, data: [] });
    }
  };

  setDate(dates, momentDates) {
    this.setState({ dates, momentDates });
    this.getData(dates);
  }

  renderContent = (isModerator) => {
    const {
      loading, dates, momentDates, data,
    } = this.state;
    if (isModerator) {
      if (loading) {
        return <KonyLoader />;
      }
      return (
        <Fragment>
          <Row className={style.panelContainer}>
            <Col span={12} className={style.datePanel}>
              <KonyButton
                title="Component Performance"
                type="action"
                color="blue"
                href="/analytics/component"
                target="_blank"
                className={style.componentPerformanceButton}
              />
              <KonyButton
                title="Search Analytics"
                type="action"
                color="blue"
                href="/analytics/search"
                target="_blank"
              />
            </Col>
            <Col span={12} className={style.datePanel}>
              <DateRangePicker
                setDate={this.setDate}
                defaultDateValuesInMoment={momentDates}
                defaultDateValues={dates}
              />
            </Col>
          </Row>
          <Row>
            <Row className={style.miniPanelContainer}>
              <Col span={8}>
                <AnalyticsMiniPanel title="Total Number Of Components" count={data.totalAssets} icon="component" className="totalComponentCount"/>
              </Col>
              <Col span={8}>
                <AnalyticsMiniPanel title="Total Number Of Downloads" count={data.totalDownloads} icon="download" className="totalDownloadsCount"/>
              </Col>
              <Col span={8}>
                <AnalyticsMiniPanel title="Total Number Of Imports to Viz Forms" count={data.totalVizImports} icon="import" className="totalVizFormsImportsCount"/>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <AnalyticsPanel title="Most Downloaded Components" data={data.topFiveDownloads} className="topFiveDownloadsCount"/>
              </Col>
              <Col span={12}>
                <AnalyticsPanel title="Most Deployed Components" data={data.topFiveDeployments} className="topFiveDeployedCount"/>
              </Col>
            </Row>
          </Row>
        </Fragment>
      );
    }

    return <PageNotFound />;
  };

  render() {
    const { marketplace, url } = this.props;
    const { config, moderatorMenu } = marketplace;
    return (
      <KonyLayout config={config} url={url}>
        <AnalyticsHeader placeholder="Search for Marketplace Assets" />
        <div>
          {
            this.renderContent(moderatorMenu
              && moderatorMenu.subMenu
              && moderatorMenu.subMenu.length > 0)
          }
        </div>
      </KonyLayout>
    );
  }
}

const mapStateToProps = ({ marketplace }) => ({ marketplace });

const mapDispatchToProps = dispatch => bindActionCreators({ ...marketplaceActions }, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnalyticsPage);
