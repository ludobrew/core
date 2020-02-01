/** @jsx jsx */
import { jsx } from "theme-ui"

export const Anchor = ({ to }) => (
  <a
    sx={{
      display: "inline-block",
      fontSize: 1,
      textDecoration: "none",
      verticalAlign: "super",
      py: 1,
      my: 1,
    }}
    target="_blank"
    href={`#${to}`}
  >
    ⚓
  </a>
)
