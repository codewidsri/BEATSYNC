async function Search(req, res, next) {
    try {
        const query = req.body.searchquery.split(" ").join("+");
        const api = `https://www.youtube.com/results?search_query=${query}`;
        const response = await fetch(api, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Sec-Ch-Ua": `"Brave";v="124", "Chromium";v="124", "Not:A-Brand";v="99"`,
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": `"Windows"`,
            }
        })
        const html = await response.text()
        const match = html.match(/var ytInitialData = (.*?);<\/script>/s);
        const ytInitialData = JSON.parse(match[1]);
        const contents = ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
        const videos = contents
            .filter(item => item.videoRenderer)
            .map(item => {
                const video = item.videoRenderer
                return {
                    title: video.title.runs[0].text,
                    thumbnail: video.thumbnail.thumbnails[1]?.url,
                    videoId : video.videoId,
                    url: 'https://www.youtube.com/watch?v=' + video.videoId,
                    duration: video.lengthText.simpleText,
                }
            })
        return res.send(videos)
    } catch (error) {
        console.error(error)
        return res.json({ 'message': "failed to fetch from youtube" })
    }
}

export default Search