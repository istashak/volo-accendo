var routesManifest = ${routes_manifest};

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  console.log("request", request);

  // Load static routes from the routesManifest
  const staticRoutes = routesManifest.staticRoutes.map(route => route.page);

  staticRoutes.forEach((route) => {
      if (uri === route || uri === route + "/") {
          request.uri = route + ".html";
          return request;
      }
  });

  return request;
}
