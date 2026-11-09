/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("tracks");

    // Idempotent: skip if a track with this title already exists.
    const existing = app.findRecordsByFilter(
      "tracks",
      "title = {:title}",
      "n",
      1,
      0,
      { title: "Colours" },
    );
    if (existing.length > 0) return;

    const emptyLinks = {
      spotify: "#",
      appleMusic: "#",
      tiktok: "#",
      youtubeMusic: "#",
      soundcloud: "#",
    };

    const record = new Record(collection);
    record.set("n", 8);
    record.set("title", "Colours");
    record.set("tag", "Coming Soon");
    record.set("links", emptyLinks);
    app.save(record);
  },
  (app) => {
    try {
      const records = app.findRecordsByFilter(
        "tracks",
        "title = {:title}",
        "n",
        100,
        0,
        { title: "Colours" },
      );
      for (const record of records) {
        app.delete(record);
      }
    } catch (e) {
      if (e.message && e.message.includes("no rows in result set")) {
        return;
      }
      throw e;
    }
  },
);
