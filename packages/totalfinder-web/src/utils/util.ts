import fs from "fs"

export function saveFile(filename, arrayBuffer) {
  fs.writeFile(filename, Buffer.from(arrayBuffer), {}, (error, data) => {
    if (error) {
      console.error(`error: ${error}`)
    }
  })
}
