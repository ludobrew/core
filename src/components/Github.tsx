/** @jsx jsx */
import { jsx, Styled } from "theme-ui"
import useGithubInfo from "../hooks/useGithubInfo"
import { graphql } from "gatsby"

export const fragments = graphql`
  fragment GithubEditLinkFileData on File {
    relativePath
    sourceInstanceName
  }
`

export const GithubEditLink = ({ file }) => {
  const { username, repo, branch } = useGithubInfo()
  const { relativePath, sourceInstanceName } = file

  if (!username && !repo && !branch && !file) {
    return null
  }

  const url = encodeURI(
    [
      `https://github.com`,
      username,
      repo,
      "edit",
      branch,
      "homebrew",
      sourceInstanceName,
      relativePath,
    ].join("/"),
  )

  return (
    <Styled.a
      sx={{
        display: "inline-block",
        fontSize: 2,
        textDecoration: "none",
        py: 1,
        my: 1,
      }}
      target="_blank"
      href={url}
    >
      [Edit]
    </Styled.a>
  )
}
