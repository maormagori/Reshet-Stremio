const axios = require("axios");

const getSeriesMeta = async (id) => {
  try {
    const seriesRes = await axios.get(
      `https://admin.applicaster.com/v12/accounts/32/broadcasters/1/categories/${id}.json?api[bundle]=com.applicaster.iReshet&api[os_type]=android&api[store]=android`
    );

    if (seriesRes.status !== 200) {
      throw seriesRes.statusText;
    }
    resData = seriesRes.data.category;
    let seriesMeta = {
      id: resData.id.toString(),
      type: "series",
      name: resData.name,
      poster: JSON.parse(resData.images_json).large_thumbnail,
      posterShape: "landscape",
      description: resData.description,
      released: resData.order_date,
      videos: await getSeriesEpisodes(resData.children[0].id),
      language: "Hebrew",
      country: "Israel",
      website: "https://13tv.co.il/",
      background: JSON.parse(resData.images_json).large_thumbnail,
    };

    return { meta: seriesMeta };
  } catch (err) {
    console.log("Error thrown trying to get series meta!");
    console.log(err);
  }
};

const getSeriesEpisodes = async (id) => {
  try {
    const episodesMetaArray = [];
    console.log("Trying to fetch seasons object with id: " + id);
    const seasonsRes = await axios.get(
      `https://admin.applicaster.com/v12/accounts/32/broadcasters/1/categories/${id}.json?api[bundle]=com.applicaster.iReshet&api[os_type]=android&api[store]=android`
    );
    if (seasonsRes.status !== 200) {
      throw seasonsRes.statusText;
    }

    const seasonsArray = seasonsRes.data.category.children;

    for (let SIndex = seasonsArray.length - 1; SIndex >= 0; SIndex--) {
      console.log(
        "Trying to fetch full episodes object with id: " +
          seasonsArray[SIndex].id
      );

      const episodesID = (
        await axios.get(
          `https://admin.applicaster.com/v12/accounts/32/broadcasters/1/categories/${seasonsArray[SIndex].id}.json?api[bundle]=com.applicaster.iReshet&api[os_type]=android&api[store]=android`
        )
      ).data.category.children[0].id;

      console.log(
        "Trying to fetch full episodes object with id: " + episodesID
      );

      const episodesArray = (
        await axios.get(
          `https://admin.applicaster.com/v12/accounts/32/broadcasters/1/categories/${episodesID}.json?api[bundle]=com.applicaster.iReshet&api[os_type]=android&api[store]=android`
        )
      ).data.category.vod_items;

      for (let EIndex = episodesArray.length - 1; EIndex >= 0; EIndex--) {
        episodesMetaArray.push({
          id: episodesArray[EIndex].id.toString(),
          title: episodesArray[EIndex].title,
          released: new Date(episodesArray[EIndex].order_date).toISOString(),
          thumbnail: JSON.parse(episodesArray[EIndex].images_json)
            .large_thumbnail,
          available: true,
          episode: episodesArray.length - EIndex,
          season: seasonsArray.length - SIndex,
          overview: episodesArray[EIndex].summary,
        });
      }
    }

    return episodesMetaArray;
  } catch (err) {
    console.log("Error thrown trying to get series episodes!");
    console.log(err);
  }
};

module.exports = { getSeriesMeta };
