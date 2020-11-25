//@ts-ignore doesn't have typdefs TODO Find them?
const tsconfig = require("gatsby-plugin-ts-config")

module.exports = tsconfig.generateConfig({
  configDir: ".gatsby",
  projectRoot: __dirname,
})
