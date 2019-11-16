import { GatsbyNode, Node, PluginOptions, CreateSchemaCustomizationArgs } from "gatsby"
import { splitProxyString } from "gatsbyNodeTools"
import { get } from "lodash"

type ProxyResolveProps = {
  from: string
}

const extensionPoint: GatsbyNode["createSchemaCustomization"] = async (props: CreateSchemaCustomizationArgs, themeOptions: PluginOptions) => {
  const { actions } = props
  const { createFieldExtension } = actions

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
}

export default extensionPoint
