import { createHash } from "crypto"
import { Node, CreatePagesArgs, NodePluginArgs, Actions } from "gatsby"
import dashify from "dashify"
import { contentBaseDir } from "./index"

/**
 * A file node sourced from gatsby-source-filesystem
 */
export type FileNode = {
  name: string
  relativePath: string
  sourceInstanceName?: string
} & Node

/**
 * Turn a series of things into a path
 * @param  {...string} args ["a", "Bee Sea"]
 * @returns {string} "/a/bee-sea"
 */
export const pathify = (...args: (string | undefined | null)[]) => {
  const pureArgs: string[] = args.filter((arg) => arg) as string[]
  return "/" + pureArgs.map((arg) => dashify(arg)).join("/")
}

/**
 * Turn a thing into an anchor to slap on a path
 */
export const anchorate = (anchor: string) => {
  return "#" + dashify(anchor)
}

/**
 * Returns the node with the internal.contentDigest set
 */
export const digest = <T extends Node>(node: T) => {
  if (!node) {
    console.log("Node was null", node)
    return null
  }
  if (!node.internal) {
    console.log("Node.internal was null", node)
    return
  }
  node.internal.contentDigest = createHash(`md5`)
    .update(JSON.stringify(node))
    .digest(`hex`)
  return node
}

export const getFilePath = (fileNode: FileNode) =>
  `${contentBaseDir}/${fileNode.sourceInstanceName}/${fileNode.relativePath}`

/**
 * Turn a "x.y.z" into a nested thing for proxyResolve
 * @param str string in a format of "x.y.z"
 * @see https://github.com/jlengstorf/gatsby-advanced-graphql/blob/master/gatsby-node.js#L14
 */
export const splitProxyString = (str: string) =>
  str.split(".").reduceRight((acc, chunk, currentIndex, arr) => {
    const isLastItem = currentIndex === arr.length - 1
    return { [chunk]: isLastItem ? true : acc }
  }, {})

/**
 * Returns a funciton that just returns the data and throws error otherwise
 *
 * @example
 * ```js
  const { graphql } = props
  const gql = simpleGraphql(graphql)
  const results = gql`query MyQuery {}`
 ```
 * @param graphql the graphql from the gatsby-node api
 * @param query
 */
export const simpleGraphql = (graphql: CreatePagesArgs["graphql"]) => {
  return async <T = any>(query: TemplateStringsArray, ...values: any) => {
    // Moosh template strings array with everything in values since we're just looking
    // for the default stringy thing.
    const interspersed: any[] = []
    for (const s of query) {
      interspersed.push(s)
      if (values.length > 0) {
        interspersed.push(values.pop())
      }
    }

    const { errors, data } = await graphql(
      [...interspersed, ...values].join(""),
    )
    if (errors) {
      throw errors
    }
    return data as T
  }
}

type HasCreateNode = {
  createNodeId: NodePluginArgs["createNodeId"]
  createContentDigest: NodePluginArgs["createContentDigest"]
  actions: {
    createNode: Actions["createNode"]
  }
}

type GameInfo = {
  /**
   * Proper name like "Exalted 3rd Edition"
   */
  gameName: string

  /**
   * Short name for reference like "Ex3"
   */
  gameShortName: string

  /**
   * Short id used in paths like /dnd5e/
   */
  gameId: string

  /**
   * Short blurb about the game itself.
   */
  gameDescription: string

  // TODO: Include other stuff for indexing.
}

export const createLudobrewEntry = <T extends HasCreateNode>(
  props: T,
  gameInfo: GameInfo,
) => {
  const { gameName, gameId } = gameInfo
  props.actions.createNode({
    id: props.createNodeId(`LudoBrewEntry ${gameName}`),
    ...gameInfo,
    url: pathify(gameId),
    internal: {
      type: "LudoBrewEntry",
      contentDigest: props.createContentDigest(gameInfo),
    },
  })
}
