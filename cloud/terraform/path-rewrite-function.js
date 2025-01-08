function handler(event) {
  var routes = ["/about/", "/resume/", "/contact/"];
  var request = event.request;
  var uri = request.uri;

  routes.forEach((route) => {
    if (uri.endsWith(route)) {
      request.uri = uri.substring(0, uri.length - 1) + ".html";
    }

    return request;
  });

  return request;
}
