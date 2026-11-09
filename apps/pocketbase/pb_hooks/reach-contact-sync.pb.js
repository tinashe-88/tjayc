/// <reference path="../pb_data/types.d.ts" />

// Reach contact sync — forwards each new subscriber to the connected Reach
// email-marketing account. Fires after a record is created in the `subscribers`
// collection (the home/EPK page Subscribe form). A failed Reach call is logged
// but never blocks the local save.
//
// NOTE: $http.send does NOT throw on HTTP errors — it returns a response object
// with a `statusCode`. We must check that status explicitly, otherwise a missing
// env var or a non-2xx Reach response is silently swallowed and the contact
// never reaches Reach (so the Reach welcome email never fires).
onRecordAfterCreateSuccess((e) => {
  const email = e.record.get("email");
  if (!email) {
    // Reach requires an email — skip the sync when absent.
    e.next();
    return;
  }

  const apiUrl = $os.getenv("REACH_API_URL");
  const apiToken = $os.getenv("REACH_API_TOKEN");

  if (!apiUrl || !apiToken) {
    $app.logger().error(
      "Reach contact sync skipped — missing env vars",
      "REACH_API_URL", apiUrl ? "set" : "missing",
      "REACH_API_TOKEN", apiToken ? "set" : "missing",
    );
    e.next();
    return;
  }

  try {
    const response = $http.send({
      url: apiUrl + "/api/public/v1/contacts",
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        groupName: "Hostinger AI Builder newsletter form",
        contacts: [
          {
            email: email,
          },
        ],
      }),
    });

    // Reach returns 204 on success. Anything else means the contact did not
    // land in Reach — log it so the failure is visible instead of silent.
    if (response.statusCode < 200 || response.statusCode >= 300) {
      let bodyText = "";
      try {
        bodyText = response.body ? response.body.string() : "";
      } catch (_) {
        bodyText = "";
      }
      $app.logger().error(
        "Reach contact sync failed",
        "email", email,
        "status", response.statusCode,
        "body", bodyText,
      );
    }
  } catch (err) {
    $app.logger().error("Reach contact sync failed", "email", email, "err", String(err));
  }
  e.next();
}, "subscribers");
