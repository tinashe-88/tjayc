/// <reference path="../pb_data/types.d.ts" />

// Release dates for each YouTube video, keyed by a normalized title fragment.
// Pocket and Plotting are intentionally absent — they stay "Coming Soon".
const RELEASE_DATES = [
  { key: "squeeze", date: "28/10/2026" },
  { key: "dulf", date: "27/10/2026" },
  { key: "halftime", date: "26/10/2026" },
  { key: "itwyw", date: "02/11/2026" },
  { key: "touches", date: "01/11/2026" },
];

const normalize = (value) => (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("youtube_videos");

    if (!collection.fields.getByName("release_date")) {
      collection.fields.add(new TextField({ name: "release_date", max: 20 }));
      app.save(collection);
    }

    const records = app.findRecordsByFilter("youtube_videos", "id != ''");
    for (const record of records) {
      const title = normalize(record.getString("title"));
      const match = RELEASE_DATES.find((t) => title.indexOf(t.key) !== -1);
      if (!match) continue;
      record.set("release_date", match.date);
      app.save(record);
    }
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("youtube_videos");
    const records = app.findRecordsByFilter("youtube_videos", "id != ''");
    for (const record of records) {
      record.set("release_date", "");
      app.save(record);
    }
    collection.fields.removeByName("release_date");
    app.save(collection);
  },
);
