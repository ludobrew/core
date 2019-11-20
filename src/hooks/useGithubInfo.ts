import { useStaticQuery, graphql } from "gatsby"

const useGithubInfo = () => {
  const data = useStaticQuery(graphql`
    query UseGithubInfoHook {
      site {
        siteMetadata {
          github {
            username
            repo
            branch
          }
        }
      }
    }
  `)

  if (data.errors) {
    throw data.errors
  }

  const { username, branch, repo } = data.site.siteMetadata.github
  return { username, branch, repo }
}

export default useGithubInfo
