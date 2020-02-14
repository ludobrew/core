import { join, resolve, dirname } from "path"
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
   * Use the package.json name like "gatsby-theme-ludobrew-exalted-3e"
   */
  pluginPackageName: string
  contentDirectories: readonly string[]
}

/**
 * Makes the default template folders, and adds any files from there.
 * @param args
 */
export const createDirectories = async function(
  args: CreateDirectoriesArgs,
): Promise<SourceTarget[]> {
  const { props, pluginPackageName, contentDirectories } = args
  const { store, reporter } = props
  const { program } = store.getState() as ExpectedGatsbyStoreState
  const myBrewRepoDir = program.directory // where it's running now

  // mybrew/homebrew/exalted3e
  const myBrewBase = join(myBrewRepoDir, contentBaseDir)
  const to_make: SourceTarget[] = contentDirectories
    .filter(dir => !existsSync(join(myBrewBase, dir)))
    .map(dir => ({
      source: resolve(
        dirname(require.resolve(pluginPackageName)),
        templateDirName,
        dir,
      ),
      target: join(myBrewBase, dir),
    }))

  if (to_make.length > 0) {
    const makeHolderFolders = to_make.map(({ target }) =>
      mkdirpasync(target, 0o775),
    )

    reporter.info(`ludobrew: Adding default folders`)
    const madeFolders = await Promise.all(makeHolderFolders)
    madeFolders.forEach(folder => reporter.log(`ludobrew: Added ${folder}`))
    const copyFiles = to_make.map(ncpasync)
    reporter.info(`ludobrew: Adding default template files to folders`)
    await Promise.all(copyFiles)
    reporter.success(`ludobrew: Copied default files`)
    return to_make
  }

  return []
}

type GenerateSourceFilesystemPluginsArgs = {
  currentDir: string
  contentDirectories: readonly string[]
}

export const generateSourceFilesystemPlugins = function(
  args: GenerateSourceFilesystemPluginsArgs,
) {
  const { contentDirectories } = args

  return contentDirectories.map(path => ({
    resolve: "gatsby-source-filesystem",
    options: {
      name: path,
      path: [contentBaseDir, path].join("/"),
      ignore: [`**/\.*`],
    },
  }))
}
