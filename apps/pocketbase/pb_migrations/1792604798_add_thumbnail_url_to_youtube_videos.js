/// <reference path="../pb_data/types.d.ts" />

const THUMBNAILS = [
  { key: "dulf", url: "https://horizons-cdn.hostinger.com/4ffce318-6603-4172-a117-1f5d149d18b6/71799097fb51faa6ef0bbb36695978c0.jpg" },
  { key: "halftime", url: "https://horizons-cdn.hostinger.com/4ffce318-6603-4172-a117-1f5d149d18b6/40e7367bb75aafdb1f06e4f739e78339.jpg" },
  { key: "itwyw", url: "https://horizons-cdn.hostinger.com/4ffce318-6603-4172-a117-1f5d149d18b6/73851c20ca0d7598bde2e8eb71039512.jpg" },
  { key: "plotting", url: "https://horizons-cdn.hostinger.com/4ffce318-6603-4172-a117-1f5d149d18b6/e5562c777f5c115888156b52a934cf25.jpg" },
  { key: "squeeze", url: "https://horizons-cdn.hostinger.com/4ffce318-6603-4172-a117-1f5d149d18b6/281cf7ac410dd68fdeeb30a98846addc.jpg" },
  { key: "pocket", url: "https://horizons-cdn.hostinger.com/4ffce318-6603-4172-a117-1f5d149d18b6/4d22586e12caca8ab624173cc76af68d.jpg" },
  { key: "touches", url: "https://horizons-cdn.hostinger.com/4ffce318-6603-4172-a117-1f5d149d18b6/57207084fcfe81d49ec1da9b07694414.jpg" },
];

const normalize = (value) => (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("youtube_videos");

    if (!collection.fields.getByName("thumbnail_url")) {
      collection.fields.add(new TextField({ name: "thumbnail_url", max: 500 }));
      app.save(collection);
    }

    const records = app.findRecordsByFilter("youtube_videos", "id != ''");
    for (const record of records) {
      const title = normalize(record.getString("title"));
      const match = THUMBNAILS.find((t) => title.indexOf(t.key) !== -1);
      if (!match) continue;
      record.set("thumbnail_url", match.url);
      app.save(record);
    }
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("youtube_videos");
    const records = app.findRecordsByFilter("youtube_videos", "id != ''");
    for (const record of records) {
      record.set("thumbnail_url", "");
      app.save(record);
    }
    collection.fields.removeByName("thumbnail_url");
    app.save(collection);
  },
);
