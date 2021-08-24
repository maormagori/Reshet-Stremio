const { addonBuilder } = require("stremio-addon-sdk");

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = {
  id: "community.Reshet",
  logo: "https://upload.wikimedia.org/wikipedia/he/thumb/5/5a/Ch13logo.svg/1200px-Ch13logo.svg.png",
  contactEmail: "maor@magori.online",
  version: "0.0.1",
  catalogs: [
    {
      type: "movie",
      id: "top",
    },
  ],
  resources: ["catalog", "stream", "meta"],
  types: ["series", "tv"],
  name: "Reshet 13",
  description:
    "Watch all the series from the famous Israeli channel Reshet 13!",
  extra: [{ name: "search", isRequired: false }],
};
const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(({ type, id, extra }) => {
  console.log("request for catalogs: " + type + " " + id);
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineCatalogHandler.md
  return Promise.resolve({
    metas: [
      {
        id: "tt1254207",
        type: "movie",
        name: "The Big Buck Bunny",
        poster:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg",
      },
    ],
  });
});

builder.defineMetaHandler(({ type, id }) => {
  console.log("request for meta: " + type + " " + id);
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineMetaHandler.md
  return Promise.resolve({ meta: null });
});

builder.defineStreamHandler(({ type, id }) => {
  console.log("request for streams: " + type + " " + id);
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineStreamHandler.md
  // return no streams
  return Promise.resolve({ streams: [] });
});

module.exports = builder.getInterface();
