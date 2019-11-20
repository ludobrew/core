import {
  GatsbyNode,
  PluginOptions,
  CreateSchemaCustomizationArgs,
} from "gatsby"

type ProxyResolveProps = {
  from: string
}

const extensionPoint: GatsbyNode["createSchemaCustomization"] = async (
  props: CreateSchemaCustomizationArgs,
  _themeOptions: PluginOptions,
) => {
  const { actions, reporter } = props
  const { createTypes } = actions
  reporter.log("Creating types")
  createTypes(`
    type Site implements Node @infer {
      siteMetadata: SiteSiteMetadata
    }

    type SiteSiteMetadata @infer {
      github: SiteSiteMetadataGithub
    }

    type SiteSiteMetadataGithub {
      username: String
      repo: String
      branch: String
    }
  `)

  return
}

export default extensionPoint
