import axios from 'axios';
import { server } from '../config'

/**
 * Fetch all hikes data in /public/contents directory.
 *
 *
 * @param hikesUrls, Array of Folder names.
 *
 * @return Array.
 */
 export const getHikesCategories = async (hikesUrls) => {

    // map all data into one request
    const urls = hikesUrls.map(url => {
        return axios.get(`${server}/contents/${url}/tours.json`)
    })

    const responses = await axios.all(urls)

    // map all response data into single array
    const categories = responses.map(res => {
        return res.data
    })

    return categories;
};
  