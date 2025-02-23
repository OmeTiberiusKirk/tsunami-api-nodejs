import * as fs from 'node:fs/promises'

export const readFile = (path: string): Promise<string> =>
  fs.readFile(process.cwd() + path, {
    encoding: 'utf8',
  })
