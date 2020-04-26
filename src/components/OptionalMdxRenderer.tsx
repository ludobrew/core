import { MDXRenderer } from "gatsby-plugin-mdx"
import React from "react"

export const OptionalMdxRenderer = ({ mdxNode }: any) =>
  mdxNode?.body ? <MDXRenderer>{mdxNode.body}</MDXRenderer> : null
