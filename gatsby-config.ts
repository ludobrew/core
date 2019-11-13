module.exports = (themeOptions: any) => {
  return {
    plugins: [
      {
        resolve: "gatsby-plugin-mdx",
        options: {
          extensions: [".mdx", ".md"],
        },
      },
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
    ],
  }
}
