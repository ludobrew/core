import { getFilePath, FileNode } from "./gatsbyNodeTools"
import { Reporter } from "gatsby"

export const generateFrontmatterCheckers = function (_: readonly string[]) {
  const errorMessage = (
    fileNode: FileNode,
    name: string,
    approvedValues: readonly string[],
  ) =>
    `${getFilePath(fileNode)} is missing a "${name}:" of [${approvedValues.join(
      " or ",
    )}]`

  const valuesPresent = <T extends Record<string, any>>(
    values: readonly string[],
    object: T,
    fileNode: FileNode,
    reporter: Reporter,
  ) => {
    for (const value in values) {
      const lookingFor = values[value]
      if (!object[lookingFor]) {
        reporter.error(errorMessage(fileNode, values[value], ["anything!"]))
      }
    }
  }

  return {
    errorMessage,
    valuesPresent,
  }
}
