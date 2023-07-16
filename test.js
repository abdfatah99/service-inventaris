let path = "public\\collection-image\\Mon Jan 02 2023 13-25-23 GMT+0700 (Western Indonesia Time)kain batik buah asem.png"

let new_path = path.replaceAll('\\', '/')
console.log(new_path)

let new_path_split = new_path.split("/")
console.log(new_path_split)
