export default (themeOptions) => {
  return {
    plugins: [
      "gatsby-plugin-react-helmet-async",
      {
        resolve: "gatsby-plugin-typescript",
        options: {
          isTSX: true,
          jsxPragma: `React`,
          allExtensions: true,
          resolveJsonModule: true,
        },
      },
      "gatsby-plugin-theme-ui",
      {
        resolve: "gatsby-plugin-mdx",
        options: {
          extensions: [".mdx", ".md"],
          remarkPlugins: [require("remark-slug")],
        },
      },
    ],
  }
}
