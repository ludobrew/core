import mkdirp from "mkdirp"
import { SourceTarget } from "./file"
import { ncp } from "ncp"

export const mkdirpasync = (dir: string, options: any) => {
  return new Promise((resolve, reject) => {
    mkdirp(dir, options, (err, made) => {
      if (err) reject(err)
      resolve(made)
    })
  })
}

export const ncpasync = ({
  source,
  target,
}: SourceTarget): Promise<SourceTarget> => {
  return new Promise((resolve, reject) => {
    ncp(source, target, { clobber: false }, err => {
      if (err) {
        reject(err)
      }
      resolve({ source, target })
    })
  })
}
