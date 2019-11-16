const path = require("path")

require('source-map-support').install()
require('ts-node').register({
  project: path.resolve(path.join(__dirname, "tsconfig.json")),
  transpileOnly: true
})

const gatsbyNodeApis = [
  "createPages",
  "createPagesStatefully",
  "createResolvers",
  "createSchemaCustomization",
  "generateSideEffects",
  "onCreateBabelConfig",
  "onCreateDevServer",
  "onCreateNode",
  "onCreatePage",
  "onCreateWebpackConfig",
  "onPostBootstrap",
  "onPostBuild",
  "onPreBootstrap",
  "onPreBuild",
  "onPreExtractQueries",
  "onPreInit",
  "preprocessSource",
  "resolvableExtensions",
  "setFieldsOnGraphQLNodeType",
  "sourceNodes",
]


module.exports = {
  ...gatsbyNodeApis.reduce((memory, api) => {
    try {
      const mod = require(`./gatsby-api/node/${api}`)
      memory[api] = mod.default
    } catch {
      // noop
    }

    return memory
  }, {})
}
