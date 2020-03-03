const fs = require("fs");
const glob = require("glob");

const files = glob.sync("src/**/*.css");

const cssToJs = str => `const css = \`${str}\`; export default css;`;

const tranfrom = file => {
  const css = fs.readFileSync(file, "utf8");
  fs.writeFileSync(`${file}.ts`, cssToJs(css.replace(/\s/g, "")));
};

files.forEach(tranfrom);
