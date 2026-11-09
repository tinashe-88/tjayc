/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const records = app.findRecordsByFilter(
      "youtube_videos",
      "title = {:title}",
      "",
      1,
      0,
      { title: "Squeeze Lyric Video" },
    );

    if (records.length === 0) {
      throw new Error("Squeeze Lyric Video record not found");
    }

    for (const record of records) {
      record.set("url", "https://www.youtube.com/watch?v=YtrxemYXTqs");
      record.set("release_date", "");
      app.save(record);
    }
  },
  (app) => {
    const records = app.findRecordsByFilter(
      "youtube_videos",
      "title = {:title}",
      "",
      1,
      0,
      { title: "Squeeze Lyric Video" },
    );

    for (const record of records) {
      record.set("url", "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      record.set("release_date", "28/10/2026");
      app.save(record);
    }
  },
);
