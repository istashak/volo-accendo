import { CloudFrontRequestHandler } from "aws-lambda";
import path from "path";
import fs from "fs";
import { Readable } from "stream";
import { IncomingMessage, ServerResponse } from "http";
import next from "next";

const NODE_ENV = "production";
const NEXT_ENV = "production";

const appDir = path.join(__dirname, ".next");
// const app = next({ dev: false, dir: appDir });
const app = next({});
const handle = app.getRequestHandler();

export const handler: CloudFrontRequestHandler = async (event) => {
  const request = event.Records[0].cf.request;
  const { uri, headers } = request;

  console.log("uri and headers", { uri, headers });
  console.log("appDir exists: " + fs.existsSync(appDir));
  console.log("appDir: " + appDir);

  console.log("NODE_ENV = " + NODE_ENV);
  console.log("NEXT_ENV = " + NEXT_ENV);

  try {
    // Ensure the app is ready
    await app.prepare();

    console.log("lambda 0");

    // Simulate an HTTP request for the Next.js handler
    const fakeReq = new IncomingMessage(new Readable() as any);
    fakeReq.url = uri;
    fakeReq.method = request.method || "GET";
    fakeReq.headers = Object.fromEntries(
      Object.entries(headers).map(([key, values]) => [key, values[0].value])
    );

    console.log("lambda 1");

    // Simulate a writable HTTP response
    const fakeRes = new ServerResponse(fakeReq);
    const responseChunks: Buffer[] = [];
    fakeRes.write = (chunk: any) => {
      responseChunks.push(Buffer.from(chunk));
      return true;
    };

    console.log("lambda 2");

    const originalEnd = fakeRes.end;
    fakeRes.end = (chunk?: any, encodingOrCb?: any, cb?: any) => {
      if (chunk) responseChunks.push(Buffer.from(chunk));
      fakeRes.finished = true;
      return originalEnd.call(fakeRes, chunk, encodingOrCb, cb);
    };

    console.log("lambda 3");

    // Process the request using Next.js
    await handle(fakeReq, fakeRes);

    // Return the response to CloudFront
    return {
      status: String(fakeRes.statusCode || 200),
      statusDescription: fakeRes.statusMessage || "OK",
      headers: Object.entries(fakeRes.getHeaders()).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key.toLowerCase()]: [{ key, value: String(value) }],
        }),
        {}
      ),
      body: Buffer.concat(responseChunks).toString(),
      bodyEncoding: "text",
    };
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      status: "500",
      statusDescription: "Internal Server Error",
      body: "Internal Server Error",
      headers: {
        "content-type": [{ key: "Content-Type", value: "text/plain" }],
      },
    };
  }
};
