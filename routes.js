const nextRoutes = require("next-routes");
const routes = (module.exports = nextRoutes());

const APP_ROUTES = [
  {
    page: "index",
    pattern: "/"
  },
  {
    page: "item",
    pattern: "/items/:item"
  },
  {
    page: "domain",
    pattern: "/domain/:domain"
  },
  {
    page: "domain",
    pattern: "/channels/:channels"
  },
  {
    page: "domain",
    pattern: "/cloud/:cloudId"
  },
  {
    page: "domain",
    pattern: "/author/:author"
  },
  {
    page: "search",
    pattern: "/search/:keyword"
  },
  {
    page: "domain",
    pattern: "/r"
  },
  {
    page: "auth",
    pattern: "/oauth/:action"
  },
  {
    page: "index",
    pattern: "/marketplace-viz/"
  },
  {
    page: "item",
    pattern: "/marketplace-viz/items/:item"
  },
  {
    page: "domain",
    pattern: "/marketplace-viz/domain/:domain"
  },
  {
    page: "domain",
    pattern: "/marketplace-viz/channels/:channels"
  },
  {
    page: "domain",
    pattern: "/marketplace-viz/cloud/:cloudId"
  },
  {
    page: "domain",
    pattern: "/marketplace-viz/author/:author"
  },
  {
    page: "search",
    pattern: "/marketplace-viz/search/:keyword"
  },
  {
    page: "domain",
    pattern: "/marketplace-viz/r"
  },
  {
    page: "auth",
    pattern: "/marketplace-viz/oauth/:action"
  },
  {
  page: "hikes",
    pattern: "/hikes"
  },
  {
  page: "tour",
    pattern: "/hikes/tour/:tour"
  },
  {
  page: "hikelisting",
    pattern: "/hikes/:category"
  },
  {
  page: "hikelisting",
    pattern: "/hikes/search/:keyword"
  },
  {
    page: "analytics",
    pattern: "/analytics"
  },
  {
    page: "componentperformance",
    pattern: "/analytics/component"
  },
  {
    page: "analyticsdetails",
    pattern: "/analyticsdetails"
  },
  {
    page: "searchanalytics",
    pattern: "/analytics/search"
  },
  {
    page: "keyworddetails",
    pattern: "/keyworddetails"
  },
];

APP_ROUTES.forEach(route => routes.add(route));
