/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  return str.length > 0
}

// 数组去重
export function uniqueArray(arr) {
  var hash = []
  for (var i = 0; i < arr.length; i++) {
    if (hash.indexOf(arr[i]) === -1) {
      hash.push(arr[i])
    }
  }
  return hash
}

// 从text中提取手机号
export function extractPhones(text) {
  var phones = []
  var result = text.match(/1[2,3,4,5,6,7,8,9]{1}[\d]{9}/g)
  if (result == null) {
    return phones.toString()
  }
  for (var i = 0; i < result.length; i++) {
    phones.push(result[i])
  }
  // var item = result.next();
  // while (item.done == false) {
  // phones.push(item.value.pop());
  // item = result.next();
  // }
  phones = uniqueArray(phones)
  return phones.toString()
}
