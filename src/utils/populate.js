import axios from 'axios';
import { SERVER } from '../config';
import { getCookie } from './cookies';
const fs = require("fs");

/**
 * Fetch all hikes data in /public/contents directory.
 *
 *
 * @param hikesUrls, Array of Folder names.
 *
 * @return Array.
 */

 function MergeLangJson(jsonLang,jsonOrigin){
    for (var key in jsonLang) {
        if (typeof(jsonLang[key]) == 'object') {
            MergeLangJson(jsonLang[key],jsonOrigin[key]);
        }else{
            if(jsonOrigin.hasOwnProperty(key)){
                jsonOrigin[key]=jsonLang[key];
            }
        }
    }
}

export const getHikesCategories = async (hikesUrls) => {

    // map all data into one request
    const urls = hikesUrls.map(url => {
        return axios.get(`${SERVER}/contents/${url}/tours.json`)
    })

    const responses = await axios.all(urls)

    // map all response data into single array
    const categories = responses.map(res => {
        return res.data
    })

    const langid=getCookie("langid");
    var Langresponses = null;
    if (typeof (langid) != 'undefined') {
        for (var url of hikesUrls.values()) {
            try {
                Langresponses = await axios.get(`${SERVER}/contents/${url}/tours_${langid}.json`);
                for (let i in categories) {
                    if (Langresponses.data["categoryAlias"] == categories[i]["categoryAlias"]) {   
                        console.log(Langresponses.data);
                        console.log(categories[i]);                 
                        MergeLangJson(Langresponses.data, categories[i]);
                    }
                }
            } catch {

            }
        }
    }



    return categories;
};
