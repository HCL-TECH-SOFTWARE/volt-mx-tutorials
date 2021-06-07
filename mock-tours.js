const fs = require("fs");
const { getHikeDirectories, HIKES_CONTENT_PATH } = require("./hike.config");

const MOCK_PATH = "./public/hike";
const hikeDirectories = getHikeDirectories();

// Creates /public/hike/tour/details
fs.mkdir(`${MOCK_PATH}/tour/details`, { recursive: true }, (err) => {
  // mock response of asset_hike_map
  const hike_map = {
    details: [[]],
    status: 200,
  };

  fs.writeFile(
    `${MOCK_PATH}/asset_hike_map.json`,
    JSON.stringify(hike_map, null, 2),
    "utf-8",
    () => {
      console.log("mocked asset_hike_map endpoint");
    }
  );

  hikeDirectories.forEach((directory) => {
    fs.readFile(
      `${HIKES_CONTENT_PATH}/${directory}/tours.json`,
      "utf8",
      function(err, data) {
        if (err) throw err;

        const tours = JSON.parse(data).categoryTours;

        tours.forEach((tour) => {
          // mock response of each hike/tour details
          fs.writeFile(
            `${MOCK_PATH}/tour/details/${tour.kuid}.json`,
            JSON.stringify(tour, null, 2),
            "utf-8",
            () => {
              console.log(`copied: ${tour.kuid}.json`);
            }
          );
        });
      }
    );
  });

  if (err) throw err;
});
