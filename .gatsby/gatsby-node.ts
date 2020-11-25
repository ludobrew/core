import { GatsbyNode } from "gatsby"

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = async (
  props,
  _themeOptions,
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
