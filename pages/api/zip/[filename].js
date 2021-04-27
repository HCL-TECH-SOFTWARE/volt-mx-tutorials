const path = require('path');

export default function handler(req, response) {
    const { filename } = req.query

    const url = 'http://localhost:3200/contents/build-your-first-mobile-app/zips/15236.zip';

    // res.download('http://localhost:3200/contents/build-your-first-mobile-app/zips/15236.zip');
    // response.status(200).send(url)
    // response.download('https://github.com/HCL-TECH-SOFTWARE/volt-mx-tutorials/raw/hikes-assets/public/contents/build-your-first-mobile-app/zips/15236.zip');

    response.download('./15236.zip', '15236.zip', () => {
        response.status(200)
    })
    

    // request.head(url, (err, res, body) => {
    //     request(url)
    //       .pipe(fs.createWriteStream('./15236dl.zip'))
    //       .on('close', () => {
    //         response.status(200).json({ name: filename })
    //       })
    // })
}

