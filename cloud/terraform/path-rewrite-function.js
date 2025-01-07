function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Rewrite `/about` to `/about.html`
    if (uri.endsWith("/about")) {
        request.uri += ".html";
    }

    return request;
}
