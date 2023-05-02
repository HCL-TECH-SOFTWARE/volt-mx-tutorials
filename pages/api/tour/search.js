import _flatten from 'lodash/flatten';
import { getMapCategories } from '../../../src/utils/populate';
import { getZipDownloadUrl } from '../../../src/utils/request';
  
const getHikeTours = async (keyword) => {
    if (!keyword) {
        return;
    }

    const hikes = await getMapCategories();

    // map all tours
    const mapTours = hikes.map(function(hike) {
        let processedHikes = hike.categoryTours;

        processedHikes.forEach(function(phike, arrindex, arrhike) {
            arrhike[arrindex].fileURL = getZipDownloadUrl(phike.fileName, hike.categoryAlias);
        });
        
        return processedHikes; 
    });

    // find matches via keyword
    const results = _flatten(mapTours).filter((tour) => {
        const { description, title, details } = tour;

        return (
            description.toLowerCase().includes(keyword.toLowerCase())
            || title.toLowerCase().includes(keyword.toLowerCase())
            || details.toLowerCase().includes(keyword.toLowerCase())
        );
    });

    return results;
};

export default async function handler(req, res) {
    let keyword = req.query.keyword;
    let results = await getHikeTours(keyword);
    let response_to_send = {
        ToursCount: results.length,
        Details: results
    }
  
    res.status(200).json(response_to_send);
}