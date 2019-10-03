import {
  GatsbyNode,
  CreateSchemaCustomizationArgs,
  PluginOptions,
  Node,
} from "gatsby"

import get from "lodash/get"
import { splitProxyString } from "./gatsbyNodeTools"

type ProxyResolveProps = {
  from: string
}

const api: GatsbyNode = {
  createSchemaCustomization: async (
    props: CreateSchemaCustomizationArgs,
    themeOptions: PluginOptions,
  ) => {
    const { actions } = props
    const { createTypes, createFieldExtension } = actions

    // From: https://github.com/jlengstorf/gatsby-advanced-graphql/blob/master/gatsby-node.js#L14
    //@ts-ignore plugin not optional
    createFieldExtension({
      name: "proxyResolve",
      args: {
        from: { type: "String!" },
      },
      extend: (options: ProxyResolveProps) => {
        return {
          // TODO find out what context/info end up being
          resolve: async (source: Node, args: any, context: any, info: any) => {
            await context.nodeModel.prepareNodes(
              info.parentType, // BlogPostMarkdown or whatever
              splitProxyString(options.from), // querying for html field
              splitProxyString(options.from), // resolve this field
              [info.parentType.name], // The types to use are these
            )

            const newSource = await context.nodeModel.runQuery({
              type: info.parentType,
              query: { filter: { id: { eq: source.id } } },
              firstOnly: true,
            })

            return get(newSource.__gatsby_resolved, options.from)
          },
        }
      },
    })
  },
}

// export const createPages = api.createPages
// export const createPagesStatefully = api.createPagesStatefully
// export const createResolvers = api.createResolvers
export const createSchemaCustomization = api.createSchemaCustomization
// export const generateSideEffects = api.generateSideEffects
// export const onCreateBabelConfig = api.onCreateBabelConfig
// export const onCreateDevServer = api.onCreateDevServer
export const onCreateNode = api.onCreateNode
// export const onCreatePage = api.onCreatePage
// export const onCreateWebpackConfig = api.onCreateWebpackConfig
// export const onPostBootstrap = api.onPostBootstrap
// export const onPostBuild = api.onPostBuild
export const onPreBootstrap = api.onPreBootstrap
// export const onPreBuild = api.onPreBuild
// export const onPreExtractQueries = api.onPreExtractQueries
// export const onPreInit = api.onPreInit
// export const preprocessSource = api.preprocessSource
// export const resolvableExtensions = api.resolvableExtensions
// export const setFieldsOnGraphQLNodeType = api.setFieldsOnGraphQLNodeType
// export const sourceNodes = api.sourceNodes
