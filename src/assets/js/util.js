function findInTree (arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    let element = arr[i]
    var flag = callback && callback(element, i, arr)
    if (flag) {
      Array.isArray(arr.children) && findInTree(arr.children, callback)
    } else {
      return
    }
  }
}

export default {
  findInTree
}
