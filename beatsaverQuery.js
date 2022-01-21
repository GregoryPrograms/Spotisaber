//Takes as input a track link, will return the first 3 results of a track query search
async function beatSaverQuery(trackLink){
    const getJson = require('get-json');
    trackLinkParsed = trackLink.replace(/ /g, "%20")
    const apiLink = 'https://api.beatsaver.com/search/text/0?q=' + trackLinkParsed +'&sortOrder=Relevance';
    let trackQuery = await getJson(apiLink);
    trackQuery = Object.keys(trackQuery).map(function(k) { return trackQuery[k] });
    trackQuery = trackQuery[0].slice(0,3); //Only get the front page of responses
    return trackQuery;
}
beatSaverQuery("bring me the horizon medicine");
exports.beatSaverQuery = beatSaverQuery;