const request = require('request');
const fs = require('fs');
const convert = require('xml-js');
const path = require('path');

const sitemapXMLPath = path.join(__dirname, './sitemap.xml');
const assetsURL = 'https://community.kony.com/api/v2_0/marketplace/item?count=1000';

async function main() {
  return new Promise(async (resolve, reject) => {
    try {
      const assets = await getMainList();
      const filteredAssets = await getFilteredAssetLinks(assets);
      const generatedXML = await generateSitemapXML(filteredAssets);
      fs.writeFileSync(sitemapXMLPath, generatedXML);
      resolve({
        generated: true
      });
    } catch (e) {
      resolve({
        generated: false
      });
    }
  });
}

function getFilteredAssetLinks(assets) {
  return new Promise((resolve, reject) => {
    const filteredResult = assets.map(asset => {
      return asset['URL'].replace('community.kony.com/marketplace', 'marketplace.kony.com');
    });
    resolve(filteredResult);
  });
}

function generateSitemapXML(assets) {
  return new Promise((resolve, reject) => {
    let tempXMLJson = {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'UTF-8',
        }
      },
      urlset: {
        _attributes: {
          'xmlns': "http://www.sitemaps.org/schemas/sitemap/0.9",
          'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
          'xsi:schemaLocation': "http://www.sitemaps.org/schemas/sitemap/0.9 \n http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
        },
        url: [{
          changefreq: {
            _text: 'daily'
          },
          loc: {
            _text: 'https://marketplace.kony.com'
          },
          priority: {
            _text: '1.0'
          }
        }]
      }
    }
    assets.forEach(asset => {
      tempXMLJson.urlset.url.push({
        loc: {
          _text: asset
        }
      });
    });
    const options = {
      compact: true,
      ignoreComment: true,
      spaces: 4
    };
    const XMLResult = convert.json2xml(tempXMLJson, options);
    resolve(XMLResult + '\n');
  });
}

function getMainList() {
  return new Promise((resolve, reject) => {
    request.get({
      url: assetsURL
    }, (error, response, body) => {
      if (!error) {
        const statusCode = response && response.statusCode;
        if (statusCode == 200) {
          const jsonBody = JSON.parse(body);
          resolve(jsonBody['Details']);
        } else {
          // Status Code not equal to 200
          reject('Status Code not equal 200');
        }
      } else {
        // Error occurred while requesting the link
        reject('Error occurred while requesting the link');
      }
    });
  });
}

module.exports = main;
