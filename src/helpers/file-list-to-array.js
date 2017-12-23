export class FileListToArrayValueConverter {

  toView(fileList) {
    let files = [];
    if (!fileList) {
      return files;
    }
    for (let file of fileList) {
      if (file.size <= 524288) { // 512 kb
        files.push(fileList.item(file));
      }
    }
    return files;
  }

}
