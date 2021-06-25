import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import _filter from 'lodash/filter';
import moment from 'moment';
import Router from 'next/router';
import AnalyticsHeader from '../src/components/AnalyticsHeader';
import { marketplaceActions } from '../src/actions';
import initialize, { instance as axios } from '../src/utils/initialize';
import KonyLayout from '../src/components/KonyLayout';
import KonyBreadcrumb from '../src/components/KonyBreadcrumb';
import DateRangePicker from '../src/components/DateRangePicker';
import KonyLoader from '../src/components/KonyLoader';
import style from './style.scss';
import PageNotFound from '../src/components/PageNotFound';
import AnalyticsFilterTable from '../src/components/AnalyticsFilterTable';
import ExportTableToCSV from '../src/components/ExportTableToCSV';
import { baseURL } from '../src/config/settings';
import { secondsToTime } from '../src/utils';

class SearchAnalyticsPage extends Component {
  columns = [
    {
      title: 'Search Term',
      dataIndex: 'searchTerm',
      sorter: (a, b) => a.searchTerm.localeCompare(b.searchTerm),
      sortDirections: ['descend', 'ascend'],
      width: 110,
    },
    {
      title: 'Total Search Uniques',
      dataIndex: 'searchUniques',
      sorter: (a, b) => a.searchUniques - b.searchUniques,
      width: 100,
    },
    {
      title: 'Average Search Depth',
      dataIndex: 'avgSearchDepth',
      sorter: (a, b) => a.avgSearchDepth - b.avgSearchDepth,
      sortDirections: ['descend', 'ascend'],
      width: 100,
    },
    {
      title: '% Search Refinements',
      dataIndex: 'percentSearchRefinements',
      sorter: (a, b) => a.percentSearchRefinements - b.percentSearchRefinements,
      sortDirections: ['descend', 'ascend'],
      width: 100,
    },
    {
      title: 'Search Duration (HH:mm:ss)',
      dataIndex: 'searchDuration',
      sorter: (a, b) => a.searchDuration - b.searchDuration,
      sortDirections: ['descend', 'ascend'],
      width: 100,
      render: text => secondsToTime(text),
    },
    {
      title: '% Conversion',
      dataIndex: 'searchGoalConversionRateAll',
      sorter: (a, b) => a.searchGoalConversionRateAll - b.searchGoalConversionRateAll,
      sortDirections: ['descend', 'ascend'],
      width: 100,
    },
  ];

  constructor(props) {
    super(props);
    const today = SearchAnalyticsPage.getFormattedDate(new Date());
    const lastWeek = SearchAnalyticsPage
      .getFormattedDate(
        new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      );

    this.state = {
      data: [],
      originalData: [],
      loading: false,
      dates: [lastWeek, today],
      momentDates: [moment(lastWeek), moment(today)],
    };
    this.setDate = this.setDate.bind(this);
    this.getData = this.getData.bind(this);
    this.filterData = this.filterData.bind(this);
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
    this.setState({ loading: true });
    try {
      const res = await axios.get('api/v1_0/marketplace/get_analytics_data', {
        params: {
          from_date: dates[0],
          to_date: dates[1],
        },
      });

      this.setState({ loading: false, data: res.data, originalData: res.data });
    } catch (error) {
      this.setState({ loading: false, data: [], originalData: [] });
    }
  };

  onChange = (pagination, filters, sorter, extra) => {
    const data = extra.currentDataSource;
    this.setState({ loading: false, data, originalData: data });
  };

  setDate(dates, momentDates) {
    this.setState({ dates, momentDates });
    this.getData(dates);
  }

  filterData(keyword) {
    const { originalData } = this.state;
    this.setState(
      {
        data: _filter(originalData,
          obj => obj
            .searchTerm
            .toString()
            .toLowerCase()
            .includes(keyword
              .toString()
              .toLowerCase())),
      },
    );
  }

  onRowClickParent = (data) => {
    const query = {
      data: encodeURIComponent(JSON.stringify(data)),
      from_date: this.state.dates[0],
      to_date: this.state.dates[1],
    };
    Router.replace({
      pathname: '/keyworddetails',
      query,
    });
  };

  renderContent = (isModerator) => {
    const {
      loading, dates, momentDates, data,
    } = this.state;
    if (isModerator) {
      return (
        <Fragment>
          <Row className={style.panelContainer}>
            <Col span={14}>
              <KonyBreadcrumb
                title="Search Analytics"
                subRoutes={
                  [
                    {
                      name: 'Dashboard',
                      path: `${baseURL}marketplace/dashboard`,
                    },
                    {
                      name: 'Analytics',
                      path: '/analytics',
                    },
                  ]
                }
              />
            </Col>
            <Col span={10} className={style.datePanel}>
              <DateRangePicker
                setDate={this.setDate}
                defaultDateValuesInMoment={momentDates}
                defaultDateValues={dates}
              />
            </Col>
          </Row>
          <Row className={style.RowContainer}>
            <Col>
              <ExportTableToCSV
                data={data}
                columns={this.columns}
                fileNameSuffix="search_analytics"
              />
            </Col>
            <Col className={style.filterTablePanel}>
              <AnalyticsFilterTable
                onRowClick={this.onRowClickParent}
                showPagination
                data={data}
                columns={this.columns}
                onChange={this.onChange}
                loading={loading}
              />
            </Col>
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
        <AnalyticsHeader
          filterData={this.filterData}
          placeholder="Search for keyword"
          search
        />
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
)(SearchAnalyticsPage);
