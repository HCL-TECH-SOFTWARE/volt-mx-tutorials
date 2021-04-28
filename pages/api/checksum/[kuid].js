const path = require('path');
const fs = require("fs");

const readfile = (res) => {
    fs.readFile("./public/contents/build-your-first-mobile-app/tours.json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("Error reading file from disk:", err);
          return;
        }
        try {
          const tour = JSON.parse(jsonString);
          res.status(200).json(tour)
        } catch (err) {
            res.status(404);
        }
    });
}

const createChecksum = (res) => {

    const checksum = 
        {
            context: "tour",
            category: [
                "Build Your First Mobile App"
            ],
            title: "1. Import & Launch a Native App",
            checksum: "877cdd472e91a72da5eb0ac29168da01fb14375222e1723d5ee9586c3de9776b",
            download_url: "https://raw.githubusercontent.com/HCL-TECH-SOFTWARE/volt-mx-tutorials/redirect-homepage/public/contents/build-your-first-mobile-app/zips/15236.zip",
            version: "1.0",
            filename: "launchyourfirstmobileapp.zip",
            kuid: "9a890157-717d-42ec-9140-c37dbdd7",
            id: "22913152361619597081568"
    }
    
    const jsonString = JSON.stringify(checksum)
    fs.writeFile('./checksums/checksum.json', jsonString, err => {
        if (err) {
            res.status(404);
        } else {
            res.status(200).json(checksum)
        }
    })
}

export default function handler(req, res) {
    createChecksum(res)
}
