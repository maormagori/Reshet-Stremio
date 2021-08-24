const axios = require("axios");

const CACHE_MAX_AGE = 86400000;
let CACHE_AGE;
let seriesMetaArray = [];

const updateCatalog = async () => {
  try {
    const seriesRes = await axios.get(
      "https://admin.applicaster.com/v12/accounts/32/broadcasters/1/categories/14830.json?api[bundle]=com.applicaster.iReshet&api[os_type]=android&api[store]=android"
    );

    if (seriesRes.status != 200) {
      throw seriesRes.statusText;
    }

    seriesMetaArray = parseSeriesToMetaObjects(
      seriesRes.data.category.children
    );

    CACHE_AGE = Date.now();
  } catch (err) {
    console.log("Error updating series catalog!");
    console.log(err);
  }
};

const parseSeriesToMetaObjects = (seriesArr) => {
  return seriesArr.map((series) => {
    images = JSON.parse(series.images_json);
    return {
      id: series.id.toString(),
      type: "series",
      name: series.name,
      poster: images.large_thumbnail,
      posterShape: "landscape",
      description: series.description,
    };
  });
};

const getCatalog = async () => {
  if (Date.now() - CACHE_AGE < CACHE_MAX_AGE) {
    return { metas: seriesMetaArray };
  }

  await updateCatalog();
  return { metas: seriesMetaArray };
};

updateCatalog();

module.exports = { getCatalog };
