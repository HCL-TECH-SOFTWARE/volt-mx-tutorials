const nextRoutes = require("next-routes");
const routes = (module.exports = nextRoutes());

const APP_ROUTES = [
  {
    page: "index",
    pattern: "/"
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
  }
];

APP_ROUTES.forEach(route => routes.add(route));
