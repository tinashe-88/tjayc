/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let collection;
    try {
      collection = app.findCollectionByNameOrId("tracks");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "tracks",
        // Public portfolio: anyone can listen. Writes are managed by the
        // site owner through the PocketBase dashboard (superuser), so the
        // REST write rules are locked to nobody.
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: "n", type: "number", required: true, onlyInt: true },
          { name: "title", type: "text", required: true, max: 200 },
          { name: "tag", type: "text", max: 100 },
          {
            name: "preview",
            type: "file",
            maxSelect: 1,
            maxSize: 52428800, // 50 MB
            mimeTypes: [
              "audio/mpeg",
              "audio/mp3",
              "audio/wav",
              "audio/x-wav",
              "audio/ogg",
              "audio/aac",
              "audio/m4a",
              "audio/x-m4a",
              "audio/flac",
            ],
          },
          {
            name: "links",
            type: "json",
            maxSize: 5000,
          },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: [
          "CREATE INDEX idx_tracks_n ON tracks (n)",
        ],
      });
      app.save(collection);
    }

    // Seed the named tracks from the portfolio. Audio previews are uploaded
    // later by the owner via the dashboard; until then `preview` is empty and
    // the play button stays disabled (matching the previous local behaviour).
    const seed = [
      { n: 1, title: "Squeeze", tag: "Coming Soon" },
      { n: 2, title: "Halftime", tag: "Coming Soon" },
      { n: 3, title: "ITWYW", tag: "Coming Soon" },
      { n: 4, title: "Touches", tag: "Coming Soon" },
      { n: 5, title: "DULF", tag: "Coming Soon" },
      { n: 6, title: "Pocket", tag: "Coming Soon" },
      { n: 7, title: "Plotting", tag: "Coming Soon" },
    ];

    const emptyLinks = {
      spotify: "#",
      appleMusic: "#",
      tiktok: "#",
      youtubeMusic: "#",
      soundcloud: "#",
    };

    for (const item of seed) {
      // Idempotent: skip if a track with this title already exists.
      const existing = app.findRecordsByFilter(
        "tracks",
        "title = {:title}",
        "n",
        1,
        0,
        { title: item.title },
      );
      if (existing.length > 0) continue;

      const record = new Record(collection);
      record.set("n", item.n);
      record.set("title", item.title);
      record.set("tag", item.tag);
      record.set("links", emptyLinks);
      app.save(record);
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("tracks");
      app.delete(collection);
    } catch (e) {
      if (e.message && e.message.includes("no rows in result set")) {
        return;
      }
      throw e;
    }
  },
);
