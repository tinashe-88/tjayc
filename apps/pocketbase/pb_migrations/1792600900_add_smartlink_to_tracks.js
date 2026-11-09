/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let collection;
    try {
      collection = app.findCollectionByNameOrId("tracks");
    } catch (_) {
      // Nothing to do if the tracks collection doesn't exist yet.
      return;
    }

    // Idempotent: only add the field if it isn't already present.
    const hasSmartlink = collection.fields.some((f) => f.name === "smartlink");
    if (!hasSmartlink) {
      collection.fields.add(
        new URLField({
          name: "smartlink",
          required: false,
        }),
      );
      app.save(collection);
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("tracks");
      const field = collection.fields.find((f) => f.name === "smartlink");
      if (field) {
        collection.fields.remove(field);
        app.save(collection);
      }
    } catch (e) {
      if (e.message && e.message.includes("no rows in result set")) {
        return;
      }
      throw e;
    }
  },
);
