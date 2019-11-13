import { createHash } from "crypto"
import { Node, CreatePagesArgs, NodePluginArgs, Actions } from "gatsby"
import dashify = require("dashify")
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
 * Strips and returns what directory it came out of. Use this because sites could have other stuff.
 * @param contentDirectories The array of content directories that could be sourced
 * @param pluginId the plugin's pluginId
 * @param fileNode the sourced fileNode
 */
export const getSourceInstanceName = function(
  contentDirectories: readonly string[],
  pluginId: string,
  fileNode: FileNode,
) {
  const sourceName = fileNode.sourceInstanceName
  if (!sourceName) {
    return null
  }

  if (sourceName.indexOf(pluginId) < 0) {
    // not found
    return null
  }

  const prefixRemoved = sourceName.slice(pluginId.length + 1, sourceName.length)

  if (contentDirectories.indexOf(prefixRemoved) < 0) {
    throw new Error(
      `ludobrew ${pluginId}: ${prefixRemoved} is not in the provided contentDirectories, but was made somewhere. Something is screwy!`,
    )
  }

  return prefixRemoved as typeof contentDirectories[number]
}

/**
 * Turn a series of things into a path
 * @param  {...string} args ["a", "Bee Sea"]
 * @returns {string} "/a/bee-sea"
 */
export const pathify = (...args: string[]) => {
  return "/" + args.map(arg => dashify(arg)).join("/")
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
 * Returns data, throws error
 * @param graphql the graphql from the gatsby-node api
 * @param query
 */
export const simpleGraphql = async (
  graphql: CreatePagesArgs["graphql"],
  query: string,
) => {
  const { errors, data } = await graphql(query)
  if (errors) {
    throw errors
  }
  return data
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
