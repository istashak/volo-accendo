import { CloudFrontRequestEvent, CloudFrontRequestHandler } from "aws-lambda";
import path from "path";
import fs from "fs";
import { Readable } from "stream";
import { IncomingMessage, ServerResponse } from "http";
import { NextUrlWithParsedQuery } from "next/dist/server/request-meta";
import next from "next";

const NODE_ENV = "production";
const NEXT_ENV = "production";

const appDir = path.join(__dirname, ".next");
// const app = next({ dev: false, dir: appDir });
const app = next({});
const handle = app.getRequestHandler();

export const handler: CloudFrontRequestHandler = async (
  event: CloudFrontRequestEvent
) => {
  const cf = event.Records[0].cf;
  const request = event.Records[0].cf.request;
  const { uri, headers, method, querystring } = request;

  console.log("event", {
    distributionDomainName: cf.config.distributionDomainName,
    eventType: cf.config.eventType,
    method,
  });

  console.log("uri, headers, method, queryString", {
    uri,
    headers,
    method,
    querystring,
  });
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
    fakeReq.method = method || "GET";
    fakeReq.headers = Object.fromEntries(
      Object.entries(headers).map(([key, values]) => [key, values[0].value])
    );
    fakeReq.complete = true;
    
    // (fakeReq as any).socket = {};  // Provide a dummy socket object
    // (fakeReq as any).connection = {}; // Simulate a connection object
    fakeReq.push(null);

    console.log("fakeRequest", {
      url: fakeReq.url,
      method: fakeReq.method,
      headers: fakeReq.headers,
    });

    console.log("lambda 1");

    // Simulate a writable HTTP response
    const fakeRes = new ServerResponse(fakeReq);
    const responseChunks: Buffer[] = [];
    const originalWrite = fakeRes.write;
    fakeRes.write = (
      chunk: any,
      encodingOrCb?:
        | BufferEncoding
        | ((error: Error | null | undefined) => void),
      callback?: (error: Error | null | undefined) => void
    ) => {
      const bufferChunk = Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk, "utf-8");
      responseChunks.push(bufferChunk);
      console.log(
        "Response body so far:",
        Buffer.concat(responseChunks).toString("utf-8")
      );
      if (typeof encodingOrCb === "function") {
        console.log("encodingOrCb is a callback function");
        // Handle case: end(chunk, cb)
        callback = encodingOrCb;
        encodingOrCb = undefined;
      }

      //return true;
      return originalWrite.call(
        fakeRes,
        chunk,
        encodingOrCb as BufferEncoding,
        callback
      );
    };

    console.log("lambda 2");

    const originalEnd = fakeRes.end;
    fakeRes.end = (
      chunk?: any,
      encodingOrCb?: BufferEncoding | (() => void),
      cb?: () => void
    ) => {
      if (chunk) {
        console.log("fakeRes.end has a last chunk", chunk);
        const bufferChunk = Buffer.isBuffer(chunk)
          ? chunk
          : Buffer.from(chunk, "utf-8");
        responseChunks.push(bufferChunk);
      } else {
        console.log("fakeRes.end has NO last chunk", chunk);
        responseChunks.push(Buffer.from("", "utf-8"));
      }
      console.log(
        "Final response body:",
        Buffer.concat(responseChunks).toString("utf-8")
      );
      if (typeof encodingOrCb === "function") {
        console.log("encodingOrCb is a callback function");
        // Handle case: end(chunk, cb)
        cb = encodingOrCb;
        encodingOrCb = undefined;
      }

      if (fakeReq.complete) {
        console.log("fakeReq is complete");
      } else {
        console.log("fakeReq is NOT complete");
        fakeReq.complete = true;
      }

       // Manually emit 'finish' to let Next.js know the response is complete
      process.nextTick(() => fakeRes.emit("finish"));

      return originalEnd.call(
        fakeRes,
        chunk,
        encodingOrCb as BufferEncoding,
        cb
      );
    };

    fakeRes.on('finish', () => {
      console.log('Finished writing to fakeRes');
    });

    console.log("lambda 3");

    // const requestUrl = new URL(fakeReq.url, "http://localhost:3000");

    // // Convert searchParams to ParsedUrlQuery format
    // const query: ParsedUrlQuery = Object.fromEntries(
    //   requestUrl.searchParams.entries()
    // );

    // Construct NextUrlWithParsedQuery
    // const parsedUrl: NextUrlWithParsedQuery = {
    //   auth: null,
    //   hash: requestUrl.hash || null,
    //   host: requestUrl.host || null,
    //   hostname: requestUrl.hostname || null,
    //   href: requestUrl.href,
    //   path: requestUrl.pathname + requestUrl.search,
    //   pathname: requestUrl.pathname,
    //   protocol: requestUrl.protocol || null,
    //   search: requestUrl.search || null,
    //   slashes: requestUrl.href.includes("//") ? true : null,
    //   port: requestUrl.port || null,
    //   query, // Ensure this follows ParsedUrlQuery format
    // };

    const parsedUrl: NextUrlWithParsedQuery = {
      auth: null,
      hash: null,
      host: null,
      hostname: null,
      href: `https://dev.voloaccendo.com/${fakeReq.url}`,
      path: fakeReq.url,
      pathname: fakeReq.url,
      protocol: "https:",
      search: null,
      slashes: null,
      port: null,
      query: {}, // Ensure this follows ParsedUrlQuery format
    };

    console.log("parsedUrl", parsedUrl);

    // Process the request using Next.js
    // await handle(fakeReq, fakeRes, parsedUrl);
    await handle(fakeReq, fakeRes);

    console.log("lambda 4");

    console.log("fakeResponse", {
      status: fakeRes.statusCode || "No fakeRes.statusCode",
      message: fakeRes.statusMessage || "No fakeRes.statusMessage",
      headers: Object.entries(fakeRes.getHeaders()).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key.toLowerCase()]: [{ key, value: String(value) }],
        }),
        {}
      ),
      body: Buffer.concat(responseChunks).toString("utf-8"),
    });

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
      body: Buffer.concat(responseChunks).toString("utf-8"),
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
