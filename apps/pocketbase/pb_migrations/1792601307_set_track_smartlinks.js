/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const smartlinks = [
      { title: "Squeeze", url: "https://ditto.fm/squeeze-tjayc" },
      { title: "Touches", url: "https://ditto.fm/touches-tjayc" },
      { title: "Pocket", url: "https://ditto.fm/pocket-tjayc" },
      { title: "Plotting", url: "https://ditto.fm/plotting-tjayc" },
    ];

    for (const item of smartlinks) {
      const records = app.findRecordsByFilter(
        "tracks",
        "title = {:title}",
        "n",
        100,
        0,
        { title: item.title },
      );

      for (const record of records) {
        record.set("smartlink", item.url);
        app.save(record);
      }
    }
  },
  (app) => {
    // Previous smartlink values are not recorded; rollback is manual.
  },
);
