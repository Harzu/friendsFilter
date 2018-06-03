Object.prototype.equals = function (obj) {
  let res

  for (let key in this) {
    for (let key2 in obj) {
      (this[key] === obj[key2] && key === key2)
        ? res = 1
        : res = 0

      if (typeof this[key] === 'object' && typeof obj[key2] === 'object') {
        const check = this[key].equals(obj[key2])
        check ? res = 1 : res = 0
      }
    }
  }

  if (res === 0) { return false }

  return true
}

Array.prototype.equals = function (array) {
  if (!array) { return false }

  if (this.length !== array.length) { return false }

  for (let i = 0, l = this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i])) { return false }
    }
    if (this[i] instanceof Object && array[i] instanceof Object) {
      if (!this[i].equals(array[i])) {
        return false
      }
    } else if (this[i] !== array[i]) {
      return false
    }
  }

  return true
}

Object.defineProperty(Array.prototype, 'equals', {enumerable: false})
Object.defineProperty(Object.prototype, 'equals', {enumerable: false})
