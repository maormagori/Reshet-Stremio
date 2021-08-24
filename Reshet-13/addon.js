const { addonBuilder } = require("stremio-addon-sdk");
const { getCatalog } = require("./updateCatalog");
const { getSeriesMeta } = require("./getSeries");

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = {
  id: "community.Reshet",
  logo: "https://upload.wikimedia.org/wikipedia/he/thumb/5/5a/Ch13logo.svg/1200px-Ch13logo.svg.png",
  contactEmail: "maor@magori.online",
  version: "0.0.1",
  catalogs: [
    {
      type: "series",
      id: "14830",
      name: "Reshet 13 Series",
      extra: [{ name: "search", isRequired: false }],
    },
  ],
  resources: ["catalog", "stream", "meta"],
  types: ["series", "tv"],
  name: "Reshet 13",
  description:
    "Watch all the series from the famous Israeli channel Reshet 13!",
};
const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(({ type, id, extra }) => {
  if (type !== "series") {
    return Promise.resolve({ meta: null });
  }

  if (extra.search) {
    const search = async (searchTerm) => {
      let filteredCatalog = await getCatalog();
      filteredCatalog.metas = filteredCatalog.metas.filter((series) =>
        series.name.includes(searchTerm)
      );
      return filteredCatalog;
    };
    return search(extra.search);
  }

  return getCatalog();
});

builder.defineMetaHandler(({ type, id }) => {
  console.log("request for meta: " + type + " " + id);

  return getSeriesMeta(id);
});

builder.defineStreamHandler(({ type, id }) => {
  console.log("request for streams: " + type + " " + id);
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineStreamHandler.md
  // return no streams
  return Promise.resolve({ streams: [] });
});

module.exports = builder.getInterface();
