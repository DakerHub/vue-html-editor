function findInTree (arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    let element = arr[i]
    var flag = callback && callback(element, i, arr)
    if (flag) {
      Array.isArray(element.children) && findInTree(element.children, callback)
    } else {
      return
    }
  }
}

function creatHtml (eles) {
  var htmlStr = ''
  eles.forEach(function (ele) {
    htmlStr += '<div class="ipanel-element" style="' + obj2Str(ele.style) + '">'
    htmlStr += '<div class="ipanel-element-inner">'
    Array.isArray(ele.children) && (htmlStr += creatHtml(ele.children))
    htmlStr += '</div></div>'
  }, this)
  return htmlStr
}

function obj2Str (obj) {
  var str = 'position:absolute;'
  for (var key in obj) {
    let result = key.match(/[A-Z]/g)
    let lowKey = key
    Array.isArray(result) && result.forEach(function (ca) {
      lowKey = lowKey.replace(ca, '-' + ca.toLowerCase())
    }, this)
    str += lowKey + ':' + obj[key] + ';'
  }
  return str
}

export default {
  findInTree,
  creatHtml
}
