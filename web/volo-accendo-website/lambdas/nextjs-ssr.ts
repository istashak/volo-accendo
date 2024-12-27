import fs from 'fs';
import path from 'path';
import { CloudFrontRequestEvent, CloudFrontRequest, CloudFrontResultResponse } from 'aws-lambda';

// Load routes manifest
const routesManifest: RoutesManifest = JSON.parse(
  fs.readFileSync('./.next/routes-manifest.json', 'utf-8')
);

export const handler = async (event: CloudFrontRequestEvent): Promise<CloudFrontResultResponse> => {
  const request: CloudFrontRequest = event.Records[0].cf.request;
  const uri: string = request.uri;

  // Match dynamic routes
  const dynamicRoute = routesManifest.dynamicRoutes.find((route) => new RegExp(route.regex).test(uri));
  if (dynamicRoute) {
    const params = getParamsFromRegex(uri, dynamicRoute.namedRegex);
    const html = await renderDynamicPage(dynamicRoute.page, params);
    return {
      status: '200',
      body: html,
      headers: {
        'content-type': [{ value: 'text/html' }],
      },
    };
  }

  // Default to 404 for unmatched routes
  return {
    status: '404',
    body: 'Page Not Found',
  };
};

// Extract params from named regex
function getParamsFromRegex(uri: string, namedRegex: string): Record<string, string> {
  const match = new RegExp(namedRegex).exec(uri);
  if (!match || !match.groups) return {};
  return match.groups;
}

// Render dynamic page
async function renderDynamicPage(page: string, params: Record<string, string>): Promise<string> {
  const pagePath = path.join('.next/server/pages', page);
  const renderPage = require(pagePath);
  return renderPage.render(params);
}

// Types for the routes manifest
interface RoutesManifest {
  dynamicRoutes: Array<{
    page: string;
    regex: string;
    namedRegex: string;
  }>;
}
