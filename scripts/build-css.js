const fs = require("fs");
const glob = require("glob");
const path = require("path");

const files = glob.sync("src/**/*.css");

const cssToJs = str => `const css = \`${str}\`; export default css;`;

const minCss = str =>
  str
    .split("\n")
    .map(_ => _.trim())
    .join("")
    .replace(/: /g, ":")
    .replace(/ {/g, "{");

const tranfrom = file => {
  const css = fs.readFileSync(file, "utf8");
  const dirname = path.dirname(file);
  const basename = path.basename(file, ".css");
  const output = path.join(dirname, basename + "-css.ts");
  fs.writeFileSync(output, cssToJs(minCss(css), ""));
};

files.forEach(tranfrom);
