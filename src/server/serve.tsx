import {
  opine,
  React,
  ReactDOMServer,
  Request,
  Response,
  NextFunction,
} from "../common/dep.ts";

import App from "../app/app.tsx";

const app = opine();
const browserBundlePath = "/browser.js";

const js = `
import React from "https://dev.jspm.io/react@16.13.1";
import ReactDOM from "https://dev.jspm.io/react-dom@16.13.1";
const App = ${App};
ReactDOM.hydrate(React.createElement(App), document.body);`;

const html = `
<html>
  <head>
    <script type="module" src="${browserBundlePath}"></script>
    <style>* { font-family: Helvetica; }</style>
  </head>
  <body>
    ${(ReactDOMServer as any).renderToString(<App />)}
  </body>
</html>`;

// Note that you wouldn't normally need to specify types for `req`, `res` and `next`.
// Deno v1.0.1 introduced a bug where it dropped support for `.tsx` files resulting in breaking typescript errors.
//
// This should be fixed in Deno v1.0.3.
//
// REF:
// - https://github.com/denoland/deno/issues/5776
// - https://github.com/denoland/deno/issues/5772
// - https://github.com/denoland/deno/pull/5785

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.originalUrl);
  next();
});

let counter = 0;
app.get("/counter", (req: Request, res: Response, next: NextFunction) => {
  res.type("application/json").send({ counter });
});
app.get("/increment", (req: Request, res: Response, next: NextFunction) => {
  res.type("application/json").send({ counter: ++counter });
});

app.use(
  browserBundlePath,
  (req: Request, res: Response, next: NextFunction) => {
    res.type("application/javascript").send(js);
  }
);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.type("text/html").send(html);
});

app.listen({ port: 3003 });

console.log(`React SSR App listening on port 3003`);
