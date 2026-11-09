/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let collection;
    try {
      collection = app.findCollectionByNameOrId("subscribers");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "subscribers",
        // Public sign-up form: anyone can submit an email. Nobody can list,
        // view, update, or delete submissions through the REST API — only the
        // site owner reads them in the PocketBase dashboard (superuser).
        listRule: null,
        viewRule: null,
        createRule: "",
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: "email", type: "email", required: true },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: [
          "CREATE UNIQUE INDEX idx_subscribers_email ON subscribers (email) WHERE email != ''",
        ],
      });
      app.save(collection);
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("subscribers");
      app.delete(collection);
    } catch (e) {
      if (e.message && e.message.includes("no rows in result set")) {
        return;
      }
      throw e;
    }
  },
);
