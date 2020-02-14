import { Global } from "@emotion/core"
import React from "react"

export const StyleReset = () => (
  <Global
    styles={{
      "html, body": {
        margin: 0,
        padding: 0,
      },
    }}
  />
)
