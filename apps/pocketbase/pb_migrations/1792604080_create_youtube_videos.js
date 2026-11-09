/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let collection;
    try {
      collection = app.findCollectionByNameOrId("youtube_videos");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "youtube_videos",
        // Public portfolio: anyone can watch. Writes are managed by the
        // site owner through the PocketBase dashboard (superuser), so the
        // REST write rules are locked to nobody.
        listRule: "",
        viewRule: "",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: "title", type: "text", required: true, max: 200 },
          { name: "url", type: "url", required: true },
          { name: "description", type: "text", max: 1000 },
          {
            name: "thumbnail",
            type: "file",
            maxSelect: 1,
            maxSize: 5242880, // 5 MB
            mimeTypes: [
              "image/jpeg",
              "image/png",
              "image/webp",
              "image/svg+xml",
              "image/gif",
            ],
          },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
      });
      app.save(collection);
    }

    // Seed the existing YouTube videos from the portfolio so the section is
    // not empty. The owner can edit/add real video URLs and upload custom
    // thumbnails via the dashboard later.
    const seed = [
      { title: "Halftime Lyric Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "" },
      { title: "Squeeze Lyric Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "" },
      { title: "D.U.L.F. Lyric Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "" },
      { title: "Touches Lyric Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "" },
      { title: "I.T.W.Y.W Lyric Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "" },
      { title: "Plotting", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "" },
      { title: "Pocket", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", description: "" },
    ];

    for (const item of seed) {
      // Idempotent: skip if a video with this title already exists.
      const existing = app.findRecordsByFilter(
        "youtube_videos",
        "title = {:title}",
        "",
        1,
        0,
        { title: item.title },
      );
      if (existing.length > 0) continue;

      const record = new Record(collection);
      record.set("title", item.title);
      record.set("url", item.url);
      record.set("description", item.description);
      app.save(record);
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("youtube_videos");
      app.delete(collection);
    } catch (e) {
      if (e.message && e.message.includes("no rows in result set")) {
        return;
      }
      throw e;
    }
  },
);
