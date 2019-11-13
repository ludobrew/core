/** @jsx jsx */
import { jsx } from "@emotion/core"
import React from "react"
import { graphql, Link } from "gatsby"

const GameLink = ({ gameName, url }) => <Link to={url}>{gameName}</Link>

export default ({ data, ...props }) => {
  return (
    <div>
      <h1 key={"top"}>My Homebrew</h1>
      {data.allLudoBrewEntry.games.map(game => (
        <React.Fragment key={game.gameId}>
          <h2>
            <GameLink {...game} />
          </h2>
          <p>{game.gameDescription}</p>
        </React.Fragment>
      ))}
    </div>
  )
}

export const query = graphql`
  query LudobrewIndexPageQuery {
    allLudoBrewEntry(sort: { fields: gameName }) {
      games: nodes {
        gameName
        gameId
        url
        gameDescription
      }
    }
  }
`
