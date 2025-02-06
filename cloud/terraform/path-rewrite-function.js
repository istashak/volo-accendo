var routesManifest = JSON.parse(JSON.stringify(${routes_manifest}));

function handler(event) {    
    var request = event.request;
    var uri = request.uri;

    console.log("request", request);

    // Load static routes from the routesManifest
    var staticRoutes = routesManifest.staticRoutes.map(route => route.page);

    for (var i = 0; i < staticRoutes.length; i++) {
        var route = staticRoutes[i];
        console.log("looking at route", route);
        if (uri === route || uri === route + "/") {
            request.uri = route + ".html";
            return request;
        }
    }

    return request;
}
