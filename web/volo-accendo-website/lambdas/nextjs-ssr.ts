import { CloudFrontRequestEvent, CloudFrontRequestResult } from "aws-lambda";
import Server from "next/dist/server/next-server";
import { parse } from "url";
import loadConfig from "next/dist/server/config";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_SERVER,
} from "next/constants";

// Determine the phase based on the NEXT_ENV variable
const phase =
  process.env.NEXT_ENV === "development"
    ? PHASE_DEVELOPMENT_SERVER
    : PHASE_PRODUCTION_SERVER;

const app = new Server({
  conf: loadConfig(phase, process.cwd()),
  dir: process.cwd(),
  minimalMode: true,
});

export const handler = async (
  event: CloudFrontRequestEvent
): Promise<CloudFrontRequestResult> => {
  const { uri, querystring } = event.Records[0].cf.request;

  const parsedUrl = parse(`${uri}?${querystring}`, true);

  // Create mock req and res objects
  const req = { url: `${uri}?${querystring}` } as any; // Simplified mock request
  const res = { write: () => {}, end: () => {} } as any; // Simplified mock response

  try {
    const html = await app.renderToHTML(
      req, // Pass mock req
      res, // Pass mock res
      parsedUrl.pathname || "/",
      parsedUrl.query
    );

    return {
      status: "200",
      headers: {
        "content-type": [{ key: "Content-Type", value: "text/html" }],
      },
      body: html || undefined,
    };
  } catch (error) {
    console.error("SSR Error:", error);
    return {
      status: "500",
      body: "Internal Server Error",
    };
  }
};
