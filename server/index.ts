import { emptyDirSync } from "https://deno.land/std@0.103.0/fs/mod.ts";
import { Application, send } from "https://deno.land/x/oak@v8.0.0/mod.ts";

const { files } = await Deno.emit("client/index.tsx", {
  bundle: "module"
});

emptyDirSync("server/static/dist");
Deno.writeTextFileSync("server/static/dist/app.js", files["deno:///bundle.js"]);

const port = 8000;
const app = new Application();

app.use(async context => {
  await send(context, context.request.url.pathname, {
    root: `${Deno.cwd()}/server/static`,
    index: "index.html"
  });
});

app.addEventListener("listen", () =>
  console.log(`Listening at http://localhost:${port}`)
);

await app.listen({ port });
