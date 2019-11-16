import { join, resolve } from "path"
import { existsSync } from "fs"
import { ParentSpanPluginArgs, PluginOptions } from "gatsby"
import { mkdirpasync, ncpasync } from "./async"

const contentBaseDir = "homebrew"
const templateDirName = "templates"

export type SourceTarget = {
  source: string
  target: string
}

type ExpectedGatsbyStoreState = {
  program: {
    directory: string
  }
}

type CreateDirectoriesArgs = {
  props: ParentSpanPluginArgs
  options: PluginOptions | undefined
  /**
   * use based on `__dirname`
   */
  pluginDirectory: string
  pluginId: string
  contentDirectories: readonly string[]
}

/**
 * Makes the default template folders, and adds any files from there.
 * @param args
 */
export const createDirectories = async function(
  args: CreateDirectoriesArgs,
): Promise<SourceTarget[]> {
  const { props, pluginDirectory, pluginId, contentDirectories } = args
  const { store, reporter } = props
  const { program } = store.getState() as ExpectedGatsbyStoreState
  const myBrewRepoDir = program.directory // where it's running now
  // mybrew/homebrew/exalted3e
  const myBrewBase = join(myBrewRepoDir, contentBaseDir, pluginId)
  const to_make: SourceTarget[] = contentDirectories
    .filter(dir => !existsSync(join(myBrewBase, dir)))
    .map(dir => ({
      source: resolve(pluginDirectory, templateDirName, dir),
      target: join(myBrewBase, dir),
    }))

  if (to_make.length > 0) {
    const makeHolderFolders = to_make.map(({ target }) =>
      mkdirpasync(target, 0o775),
    )

    reporter.info(`ludobrew ${pluginId}: Adding default folders`)
    const madeFolders = await Promise.all(makeHolderFolders)
    madeFolders.forEach(folder =>
      reporter.log(`ludobrew ${pluginId}: Added ${folder}`),
    )
    const copyFiles = to_make.map(ncpasync)
    reporter.info(
      `ludobrew ${pluginId}: Adding default template files to folders`,
    )
    await Promise.all(copyFiles)
    reporter.success(`ludobrew ${pluginId}: Copied default files`)
    return to_make
  }

  return []
}

type GenerateSourceFilesystemPluginsArgs = {
  currentDir: string
  pluginId: string
  contentDirectories: readonly string[]
}

export const generateSourceFilesystemPlugins = function(
  args: GenerateSourceFilesystemPluginsArgs,
) {
  const { pluginId, contentDirectories, currentDir } = args

  return contentDirectories.map(path => ({
    resolve: "gatsby-source-filesystem",
    options: {
      name: [pluginId, path].join("/"),
      path: [contentBaseDir, pluginId, path].join("/"),
      ignore: [`**/\.*`],
    },
  }))
}
