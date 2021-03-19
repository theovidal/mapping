function download(name, type, data: string) {
  let blob = new Blob([data], { type });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, name)
  }
  else{
    let elem = window.document.createElement('a')
    elem.href = window.URL.createObjectURL(blob)
    elem.download = name
    document.body.appendChild(elem)
    elem.click()
    document.body.removeChild(elem)
  }
}

export { download }
export default download
