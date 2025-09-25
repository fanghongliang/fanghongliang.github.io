const { log } = console


// log('map', map, map[8])

// const twoNum = (arr, target) => {
//   let map = {}
//   for (let i=0; i<arr.length; i++) {
//     if (map[target - arr[i]]) {
//       // log('map', [target - arr[i], arr[i]])
//       return [target - arr[i], arr[i]]
//     } else {
//       map[arr[i]] = i
//     }
//   }
  
// }

function twoNum(arr, target) {
  let map = {}  
  for(let i = 0; i<arr.length; i++ ) {
    if (map[target-arr[i]]) {
      log('@@==',[target-arr[i], arr[i]])
      return [target-arr[i], arr[i]]
    } else {
      map[arr[i]] = i
    }
  }
}

// 暴力破解
function twoNum5(arr, target) {
  for(let i = 0 ; i< arr.length; i++) {
    for(let j = i+1; j< arr.length; j++) {
      if (arr[i] + arr[j] === target) {
        log('@@=ttttt', [i, j])
        return [arr[i], arr[j]]
      }
    }
  }
}

// twoNum5([8, 2, 6, 5, 4, 1, 3], 7)




// const twoNum2 = (arr, target) => {
//   let map = {}
//   for( let i=0; i<arr.length; i++) {
//     // 判断target - arr[i] 是否在map
//     if (map[target - arr[i]]) {
//       log('map',map[target - arr[i]] , map, [ target-arr[i], arr[i]])
//       return [ target-arr[i], arr[i]]
//     } else {
//       map[arr[i]] = i
//       log('else', i, arr[i], map)

//     }
//   }
// }


// twoNum2([8, 2, 6, 5,2, 1, 3],6)



/**
 * 
 * 三数之和
 * 
 */



/***
 * 
 * 
 * 冒泡排序
 * 关键： 两层遍历，大的往后排
 * arr = [5,1,2,8,3,6]
 */

const bubbleSort = (arr) => {
  let len = arr.length
  for(let i =0; i<len; i++) {
    for(let j=0; j<len-i-1; j++) {
      if (arr[j]>arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
      }
    }
  }
  log(arr)
} 

// bubbleSort([5,1,2,8,3,6])

const bubbleSort1 = (arr)  => {
  let len = arr.length;
  for(let i = 0; i<len; i ++) {
    for(let j = 0; j<len-i-1; j++) {
      if (arr[j]>arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
      }
    }
  }
  log(arr)
  return arr
}

// bubbleSort1([5,1,2,8,3,6])


/**
 * 
 * 选择排序
 * 关键点：选择最小的值跟头部的交换位置，  第二次遍历仅选择最小的index，
 */

const selectSort = ( arr ) =>{
  let minIndex = 0
  for(let i = 0; i<arr.length; i++) {
    minIndex = i
    for(let j = i+1; j<arr.length; j++ ) {
      if (arr[j]<arr[minIndex]) {
        minIndex = j
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  log('selectSort', arr)
  return arr
}

// selectSort([5,1,2,8,3,6])


// selectSort([5,1,2,8,3,6]) 

/***
 * 
 * 插入排序
 * 关键： 从target开始，向前遍历，找到一个比目标元素小的的元素，插在其后
 */

let arr = [5,1,2,8,3,6]
// const insertSort = (arr) => {
//   for(let i=1; i<arr.length; i++) {
//     let j = i
//     let target = arr[j]
//     while( j > 0 && arr[j-1] > target) {
//       arr[j] = arr[j-1]
//       j--
//     }
//     arr[j] = target
//   }
//   log('aeee', arr)
//   return arr
// }

// const insertSort = ( arr) => {
//   for(let i=0; i< arr.length; i++) {
//     let j = i
//     let target = arr[j]
//     while(j> 0 && arr[j-1] > target) {
//       arr[j] = arr[j-1]
//       j--
//     }
//     arr[j] = target
//   }
//   log('222',arr)
// }


const insertSort = (arr) => {
  for(let i = 0; i< arr.length; i++) {
    let j = i 
    let target = arr[i] 
    while(j > 0 && arr[j-1] > target) {
      arr[j] = arr[j-1]
      j--
    }
    arr[i] = target
  }
}

// insertSort(arr)


/***
 * 
 * 
 * 快排 
 * 关键： 找到中间节点，比该节点值大的放在右边，小的放在左边，进行递归
 * 注意啊arr.length <= 1 推出返回arr
 */

// const quickSort = (arr) => {
//   if (arr.length <= 1) {
//     log('ARRR', arr)
//     return arr
//   }
//   // let middle = Math.floor(arr.length / 2) // let mid = Math.floor(list.length / 2);
//   let middle = Math.floor(arr.length / 2); // let mid = Math.floor(list.length / 2);

//   let base = arr.splice(middle, 1)[0];
//   let left = []
//   let right = []
//   arr.forEach(item => {
//     if (item > base ) {
//       right.push(item)
//     } else {
//       left.push(item)
//     }
//   });
//   return quickSort(left).concat(base, quickSort(right))
//   return quickSort(left).concat(base, quickSort(left))
// }


const quickSort = ( arr) => {
  if (arr.length <= 1) {
    return arr
  }
  let minIndex = Math.floor(arr.length / 2)
  let base = arr.splice(minIndex, 1)[0]
  let left = []
  let right = []
  arr.forEach(item => {
    if (item < base ) {
      left.push(item)
    } else {
      right.push(item)
    }
  })
  return quickSort(left).concat(base, quickSort(right))
}

// const a = quickSort(arr)
// log('aaaaa', a)


/**
 * 冒泡
 * key: 两层排序，大的往后排
 */

const bubbleSort2 = ( arr ) => {
  for(let i=0; i< arr.length; i++) {
    for(let j=0; j<arr.length - i -1; j++) {
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
      }
    }
  }
  log('aeeee-888', arr)
}


/**
 * 快排
 * 二分forEach递归
 * 
 */

const quickSort3 = ( arr ) => {
  if (arr.length <= 1) {
    return arr
  }
  let index = Math.floor(arr.length /2);
  let base = arr.splice(index, 1)[0]
  let left = [], right= [];
  arr.forEach(item => {
    if (base > item ) {
      left.push(item)
    } else {
      right.push(item)
    }
  })
  return quickSort3(left).concat(base,quickSort3(right) )
}

// const a  = quickSort3(arr)
// log('dddddd', a)



/**
 * 
 * 链式调用
 * 
 */

let Monkey = function() {}

Monkey.prototype.eat = function( food ) {
  this.food = food;
  log(`Monkey eat ${this.food}`)
  return this 
}

Monkey.prototype.run = function( m ) {
  this.m = m;
  log(` and run ${this.m} 米`)
  return this 
}

Monkey.prototype.sleep = function( time ) {
  this.time = time;
  log(`and sleep ${this.time} 小时`)
  return this 
}

const m1 = new Monkey()

// m1.eat('boolean').run(100).sleep(8)


const Monkey1 = {
  name: '',
  age: '',
  setName: function(name) {
    this.name = name
    return this
  },
  setAge: function(age) {
    this.age = age
    return this

  },
  get: function(){
    log(`${this.name}已经${this.age}岁了`)
  }
}


let Monkey11 = function() {}
// Monkey1.setName('小明').setAge(18).get()

const sleep = function( delay ) {
  let date = +new Date()
  let endTime = date + delay
  while(true) {
    if ( +new Date() > endTime ) {
      return
    }
  }
}



function sleep2  (delay) {
  return new Promise((res, rej) => {
    setTimeout(res, delay)
  })
}

// 思考： 以下执行顺序是什么？原理

// log(1)
// sleep2(1000).then(() => {
//   log(2)
// })
// log(3)


/**
 * 
 * 三数之和
 * 
 * ： 给定一个数组nums，判断 nums 中是否存在三个元素a，b，c，使得 a + b + c = target，找出所有满足条件且不重复的三元组合
 * 输入： nums: [5, 2, 1, 1, 3, 4, 6] ；target:8
 * 输出： [[1, 1, 6], [1, 2, 5], [1, 3, 4]]
 */









// 使用动态规划，将复杂的问题拆分，也就是：`F(N) = F(N - 1) + F(N - 2)`，用数组将已经计算过的值存起来
// **`BigInt`** 是一种内置对象，它提供了一种方法来表示大于 `2^53 - 1` 的整数



const fib = (n) => {
  if (n < 2 ) return 1 
  let dp = [1n, 1n]
  for(let i=2; i<=n; i++) {
    dp[i] = dp[i-1] + dp[i-2]
  }
  return dp[n]
}

// const a = fib(5)
// log('aaaa= ', a)


/**
 * 插入排序
 * 关键： 从target开始，while 向前遍历，找到一个比目标元素小的的元素，插在其后
 */

// 4、3、6、2
/**
 * 
 * j = 1 \ target = 3
 * 4、4、6、2
 * 3、4、6、2
 * 
 * i = 2; j= 2 target =6
 * i= 3; j= 3 target = 2
 * 
 * 3\4\6\6
 * 3\4\4\6
 * 3\3\4\6
 * 2\3\4\6
 * 
 */
const insertSortA = (arr) => {
  for(let i=1; i< arr.length; i++) {
    let j = i
    let target = arr[j]
    while(j > 0 && arr[j-1] > target) {
      arr[j] = arr[j-1]
      j--
    }
    arr[j] = target
  }
}


/**
 * 
 * 快速排序
 * 一分为二，
 */

const quickSort44 = (arr) => {
  if (arr.length <= 1) {
    return arr
  }
  let midIndex = Math.floor(arr.length / 2)
  let base = arr.splice(midIndex, 1)[0]
  let left = [], right = []
  arr.forEach(item => {
    if (base > item ) {
      left.push(item)
    } else {
      right.push(item)
    }
  })
  return quickSort44(left).concat(base, quickSort44(right))
} 


// const a1 = quickSort44(arr)
// log('aaaaa', a1 )


/**
 * 
 * 选择排序
 * 选择最小值下标，把该值放在第一位
 */
const selectSortA= (arr) => {
  let index = 0
  for(let i=0; i<arr.length; i++) {
    index = i 
    for(let j = i+1; j<arr.length; j++) {
      if (arr[j]< arr[index]) {
        index = j
      }
    }
    [arr[i], arr[index]] = [arr[index], arr[i]]
  }
  return arr
}


/**
 * 
 * 输出第一个不重复字符串的下标
 * 
 * 输入一个字符串，找到第一个不重复字符的下标

输入： 'abcabcde'

输出： 6
 * 
 */

const findOneStr = ( str ) => {
  if (!str) return -1
  let arr = str.split('')
  let map = {}
  arr.forEach(item => {
    let val = map[item]
    map[item] = val ? val+1 : 1
  }) 
  for(let i=0; i< arr.length; i++) {
    if (map[arr[i]] === 1 ) {
      return i
    }
  }
}

// const s1 = findOneStr('abcabcde')
// log('s1', s1)



/**
 * 
 * 归并排序
 * 双指针分而治之
 * 
 */

const merge1 = (left,right) => {
  let i = 0, j= 0;
  let result= []
  while(i<left.length && j<right.length) {
    if (left[i]< right[j]) {
      result.push(left[i])
      i++
    } else {
      result.push(right[j])
      j++
    }
  }

  while(i < left.length) {
    result.push(left[i])
    i++
  }

  while(j < right.length) {
    result.push(right[j])
    j++
  }

  return result
}

const mergeSort1 = (arr) => {
  if (arr.length <=1) {
    return arr
  }
  let mid = Math.floor(arr.length / 2 )
  let left = mergeSort(arr.slice(0, mid))
  let right = mergeSort(arr.slice(mid, arr.length))
  return merge(left,right)
  
}


const merge = (left, right) => {
  let i=0, j=0;
  let res = []
  while(i<left.length && j<right.length) {
    if (left[i] < right[j]) {
      res.push(left[i])
      i++
    } else {
      res.push(right[j])
      j++
    }
  }

  // let i = 0, j= 0;
  // let result= []
  // while(i<left.length && j<right.length) {
  //   if (left[i]< right[j]) {
  //     result.push(left[i])
  //     i++
  //   } else {
  //     result.push(right[j])
  //     j++
  //   }
  // }

  while(i < left[i]) {
    res.push(left[i])
    i++
  }

  while(j < right.length) {
    res.push(right[j])
    j++
  }

  return res
}


const mergeSort = (arr) => {
  if (arr.length <=1) {
    return arr
  }
  let midIndex = Math.floor(arr.length / 2 )
  let left = mergeSort(arr.slice(0, midIndex))
  let right = mergeSort(arr.slice( midIndex, arr.length))
  return merge(left, right)
}
// const res = mergeSort(arr)
// log('mergeSort', res)



/**
 * 03-10
 * 
 * 
两数之和： 一次遍历，数组存入数据，target相减存在即返回
冒泡算法： 两层遍历，大的往后排
选择排序： 选择最小的值跟头部的交换位置，  第二次循环仅选择最小的index，
插入排序： 从target开始，while 向前遍历j--，找到一个比目标元素小的的元素，插在其后 **!!!!
快速排序： 递归中间值；splice找到中间节点的值，forEach比该节点值大的放在右边，小的放在左边，进行递归
归并算法： 递归 双指针分而治之。
动态fib: 动态规划解决fib斐波那契数列 dp[i] = dp[i-1] + dp[i-2]  （爬楼梯算法）
*/


const twoNum10 = (arr, target) => {
  // let map = {}
  // for( let i= 0; i< arr.length; i++ ) {
  //   if ( map[target - arr[i]]) {
  //     return [arr[i], target-arr[i]]
  //   }
  //   map[arr[i]] = i
  // }

  // let res = []
  // for(let i=0; i< arr.length; i++) {
  //   if (res.includes(target - arr[i])) {
  //     return [target-arr[i], arr[i]]
  //   }
  //   res.push(arr[i])
  // }

  // for(let i =0; i< arr.length; i++) {
  //   for(let j=0; j< arr.length; j++) {
  //     if (arr[i] + arr[j] == target) {
  //       return [arr[i] , arr[j]]
  //     }
  //   }
  // }
}

const bubbleSort10 = (arr) => {
  for(let i = 0; i< arr.length ; i++) {
    for(let j=0; j< arr.length - i - 1; j++) {
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
      }
    }
  }
  log('bubble10-', arr)
  return arr
}

const selectSort10 = (arr) =>{
  // 选择排序，选择最小的值跟头部交换、第二次循环只为拿到最小的index
  let minIndex = 0
  for(let i=0; i<arr.length; i++) {
    minIndex = i
    for(let j=i+1; j< arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  log('selectSort10', arr)
}


//插入排序： 从target开始，while 向前遍历j--，找到一个比目标元素小的的元素，插在其后 **!!!!

const insertSort10 = (arr) => {
  for(let i=1; i<arr.length; i++) {
    let j=i
    let target = arr[j]
    while(j > 0 && arr[j-1] > target) {
      arr[j] = arr[j-1]
      j--
    }
    arr[j] = target
  }
  return arr
}
// let ff = insertSort10(arr)
// log('aaaaa', ff)

const quickSort10 = (arr) => {
  if (arr.length <= 1) {
    return arr
  }
  let midIndex = Math.floor(arr.length / 2 )
  let target = arr.splice(midIndex, 1)[0]
  let left = [], right= []
  arr.forEach(item => {
    if (item > target) {
      right.push(item)
    } else {
      left.push(item)
    }
  })
  return quickSort10(left).concat(target, quickSort10(right))
}


const fib10 = (n) => {
  // let dp = [1n,1n] 
  // for(let i=2; i<=n; i++) {
  //   dp[i] = dp[i-1]+dp[i-2]
  // }
  // return dp[n]

  // 上楼梯
  // let map = []
  // map[1] = 1
  // map[2] = 2 
  // for(let i=3; i<=n; i++) {
  //   map[i] = map[i-1] + map[i-2]
  // }
  // return map[n]
} 

const merge10 = (left, right) => {
  let i=0; j=0; res = []
  while(i< left.length && j < right.length) {
    if (left[i] < right[j]) {
      res.push(left[i])
      i++
    } else {
      res.push(right[j])
      j++
    }
  }

  while(i < left.length) {
    res.push(left[i])
    i++
  }

  while( j < right.length) {
    res.push(right[j])
    j++
  }

  return res
}
const mergeSort10 = (arr) => {
  if (arr.length <=1) {
    return arr
  }
  let mid = Math.floor(arr.length / 2 )
  let left = mergeSort10(arr.slice(0, mid))
  let right = mergeSort10(arr.slice(mid, arr.length))
  return merge10(left,right)
}


const Monkey10 = function() {}

Monkey10.prototype.setName= function(name) {
  this.name = name
  log(`我是${name}`)
  return this 
}
Monkey10.prototype.setAge= function(age) {
  this.age = age
  log(`,${age}岁`)
  return this 
}
Monkey10.prototype.setLevel= function(level) {
  this.level = level
  log(`上${level}年级`)
  return this 
}

const sleep10 = function(delay) {
  // let date = +new Date()
  // let endTime = date + delay
  // while(true) {
  //   if (+new Date() > endTime) {
  //     return 
  //   }
  // }
  // return new Promise(res => {
  //   setTimeout(res, delay)
  // })
}

// 核心思路！： 返回一个大Promise，然后遍历内部promise函数，执行成功计数器加一，全部执行完毕则返回

const promiseAll = function (promiseAll) {
  return new Promise((resolve, reject) => {
    let completeIndex = 0
    let result = []
    promiseAll.forEach((promise, index) => {
      Promise.resolve(promise).then(res => {
        result[index] = res
        completeIndex++
        if (promiseAll.length === completeIndex) {
          resolve(result)
        }
      }).catch(err => {
        reject(err)
      })
    })
  })
}


// const PromiseRace = function(promiseArr = []) {
//   return new Promise((resolve, reject) => {
//     promiseArr.forEach((promise, index) => {
//       Promise.resolve(promise).then(res => {
//         resolve(res)
        
//       }).catch(err => {
//         reject(err)
//       })
//     })
//   })
// } 

const promise1 = Promise.resolve(300010);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, 'foo');
});
// promiseAll([promise1, promise2, promise3])
//     .then((results) => {
//         console.log(results); // [3, 42, 'foo']
//     })
//     .catch((error) => {
//         console.error(error);
//     });


/**
 * 简易版发布订阅者模式
 * 
 */

class EventEmitter  {
  constructor() {
    this._events = {}
  }

  on(eventName, callback) {
    const callbacks = this._events[eventName] || []
    callbacks.push(callback)
    this._events[eventName] = callbacks
  }

  emit(eventName, ...args) {
    const callbacks = this._events[eventName] || []
    if (callbacks.length === 0 ) {
      return
    }
    callbacks.forEach(cb => cb(...args))
  }


  off(eventName, callback) {
    const callbacks = this._events[eventName] || []
    const newCallBacks = callbacks.filter(item => item != callback)
    this._events[eventName] = newCallBacks
  }

  once(eventName, callback) {
    const one = (...args) => {
      callback(...args)
      this.off(eventName,one )
    }
    this.on(eventName, one)
  }
}


/**
 * 
 * instanceof 
 * 核心： 右边值的prototype 是否在左边值的__proto__上
 */

const myInstanceof = ( leftVal, rightVal) =>{
  let proto = rightVal.prototype
  let l = leftVal.__proto__
  while(l != null) {
    if (proto == l) {
      return true
    }
    l = l.__proto__
  }
}


const merge13 = (left, right) => {
  let i=0, j=0, result = [];
  while(i<left.length && j< right.length) {
    if (left[i] < right[j]) {
      result.push(left[i])
      i++
    } else {
      result.push(right[j])
      j++
    }
  }

  while(i < left.length) {
    result.push(left[i])
    i++
  }

  while(j < right.length) {
    result.push(right[j])
    j++
  }

  return result
}

const mergeSort13 = (arr) => {
  if (arr.length <=1) {
    return arr
  }
  let mid = Math.floor(arr.length / 2)
  let left = mergeSort13(arr.slice(0, mid))
  let right = mergeSort13(arr.slice(mid, arr.length))
  return merge13(left, right)
}


const deepClone = (target, hash = new WeakMap()) => {

  if (typeof target !== 'object') return target 

  if (hash.get(target)) {
    return hash.get(target)
  }
  const cloneTarget = new target.constructor()
  hash.set(target, cloneTarget)
  Reflect.ownKeys(target).forEach(key => {
    cloneTarget[key] = deepClone(target[key], hash)
  })
  return cloneTarget
}



























//////////---------


// 1.编写一个函数，将平级的树形结构转化为tree结构。parentId为空代表根节点
// const arr = [
//   { id: "1", parentId: "", name: "1节点" },
//   { id: "2", parentId: "", name: "2节点" },
//   { id: "3", parentId: "", name: "3节点" },
//   { id: "4", parentId: "2", name: "2-1节点" },
//   { id: "5", parentId: "1", name: "1-1节点" },
//   { id: "6", parentId: "2", name: "2-2节点" },
//   { id: "8", parentId: "5", name: "1-1-1节点" },
//   { id: "7", parentId: "3", name: "3-1节点" },
// ];

/***
 * [
  {
    id: "1",
    parentId: "",
    name: "1节点",
    children: [
      {
        id: "5",
        parentId: "1",
        name: "1-1节点",
        children: [{ id: "8", parentId: "5",  name: "1-1-1节点" }],
      },
    ],
  },
  {
    id: "2",
    parentId: "",
    name: "2节点",
    children: [
      { id: "4", parentId: "2", name: "2-1节点" },
      { id: "6", parentId: "2", name: "2-2节点" },
    ],
  },
  {
    id: "3",
    parentId: "",
    name: "3节点",
    children: [{ id: "7", parentId: "3", name: "3-1节点" }],
  },
];
 */


const tranTrr = (arr) => {
  let res = []
  arr.forEach((item, index) => {
    if (item.parentId === '') {
      // 处理根节点
      res.push(item)
    }
  })
  // 递归处理
  // 处理根节点的字元素
  for(let i=0; i<res.length; i++) {
    let target = res[i]
    target.children = []
    let targetId = res[i].id
    let aimArr = arr.filter(item => item.parentId === targetId)
    target.children.push( aimArr )
  }


  for(let i=0; i<res.length; i++) {
    let targetArr = arr[1].children
    targetArr.forEach(item => {
      // arr.forEach(originArr => {

      // })
    })
  }



  // for(let i=0; i<arr.length; i++) {
  //   if (arr[i].parentId === '') {
  //     res.push(arr[i])
  //   }
  //   // 
  //   if () {

  //   }
  // }



  // 
  // let res  = []
}


const flatArr = ( arr ) => {
  let res = []
  for(let i = 0; i< arr.length; i++) {
    if (arr[i][children]) {
      arr[i][children].forEach(child => {
        res.push(child)
      })  
    }
  }
  flatArr(res)
}


// 加减法
// 思路，两层循环，打散number为字符串。从低位开始做加法，最终拼接
const addBigNum =( num1, num2) => {
  // num1= 12345 6
  // num2= 65432 1
  let res = 0
  const str1 = num1.toString().split('')
  const str2 = num2.toString().split('')
  let bit = 1

  for(let i=str1.length-1; i>=0; i--) {
    let result = Number(str1[i]) + Number(str2[i])
    while(str1.length - i > 0) {
      bit = bit * 10
    }
    res += result * bit
  }
  return res
}

let data666 = [
  { id: 1, title: "child1", parentId: 0 },
  { id: 2, title: "child2", parentId: 0 },
  { id: 3, title: "child1_1", parentId: 1 },
  { id: 4, title: "child1_2", parentId: 1 },
  { id: 5, title: "child2_1", parentId: 2 },
  { id: 6, title: "child2_1", parentId: 3 }
]


const treeData = (data) => {
  let map = {}
  let treeArr = []

  for(let i=0; i<data.length; i++) {
    map[data[i].id] = data[i]
  }

  for(let key in map) {
    // 有父节点
    if (map[key].parentId) {
      if (!map[map[key].parentId].children) {
        map[map[key].parentId].children = []
      }
      map[map[key].parentId].children.push(map[key])
    } else {
      treeArr.push(map[key])
    }
  }
  return treeArr
}

const treeDataCopy = (data) => {
  let map = {}
  let resArr = []
  data.map(item => {
    map[item.id] = item
  })
  Object.keys(map).map(id => {
    // 处理非根节点
    if (map[id].parentId) {
      if (!map[map[id].parentId].children) {
        map[map[id].parentId].children = []
      }
      map[map[id].parentId].children.push(map[id])
    } else {
      resArr.push(map[id])
    }
  })
  return resArr
}

// 核心点 建立map  Object.key()


const treeData333 = (data666) => {
  let map = {}
  // data666.map(item => {
  //   map[id] = item
  //   log('@@===HHHH', map)
  // })
  log('@@====', data666)
}
// treeDataCopy()

treeData333()









// const a14 = treeDataCopy(data)
// log('a14==>', JSON.stringify(a14))

let treeData123 = [
  {
    "id":1,
    "title":"child1",
    "parentId":0,
    "children":[
      {
        "id":3,
        "title":"child1_1",
        "parentId":1,
        "children":[
          {"id":6,"title":"child2_1","parentId":3}
        ]
      },
      {
        "id":4,
        "title":"child1_2",
        "parentId":1
      }
    ]
  },
  {
    "id":2,
    "title":"child2",
    "parentId":0,
    "children":[
      {"id":5,"title":"child2_1","parentId":2}
    ]
  }
]

const deepTreeFlap = (tree, arr = []) => {
  if (!tree || !tree.length) return arr;
  tree.forEach(data => {
    arr.push(data);
    // 遍历子树
    if (data.children) {
      deepTreeFlap(data.children, arr);
      delete data.children
    }
  });
  return arr.sort((a,b) => a.id-b.id);
}

const deepTreeFlapCopy = (tree, arr = []) => {
  if (!tree || !tree.length) return arr
  // tree.forEach(data => {
  //   arr.push(data)
  //   if (data.children) {
  //     deepTreeFlapCopy(data.children, arr)
  //     delete data.children
  //   }
  // })

  tree.forEach(data => {
    arr.push(data)
    if (data.children) {
      deepTreeFlap(data.children, arr)
      delete data.children
    }
  })
  return arr
}

const b14 = deepTreeFlapCopy(treeData123)
log('b14', b14)


/**
 * 
 * 大数相加
 * 
 */

// let a1 = '9007199254740991'
// let b1 = '1234567899999999999'


const add = (a,b) => {

  let maxLength = Math.max(a.length, b.length)
  a = a.padStart(maxLength, 0)
  b = b.padStart(maxLength, 0)
  let t = 0
  let f = 0
  let sum = ""
  for(let i = maxLength-1; i>=0; i--) {
    t = parseInt(a[i]) +  parseInt(b[i]) + f
    f = Math.floor(t/10)
    sum = t%10 + sum
  }
  if (f == 1) {
    sum = '1' + sum
  }
  return sum
}

let saa = "9007199254740991";
let sab = "1234567899999999999";




const bigIntAdd = (a,b) => {
  let maxLength = Math.max(a.length, b.length)
  a = a.padStart(maxLength, 0)
  b = b.padStart(maxLength, 0)
  let t = 0
  let f = 0
  let sum = ""
  for(let i= maxLength-1; i>=0; i--) {
    t = parseInt(a[i]) + parseInt(b[i]) + f
    f = Math.floor(t/10)
    sum =  t%10 + sum
  }
  if (f == 1) {
    sum = "1" + sum
  }
  return sum 
}

// const resBig = bigIntAdd(saa,sab)
// console.log('@@===KKKK-1',resBig )


/**
 * 
 * 微任务、宏任务
 * 
 */

console.log('1');

setTimeout(function() {
  console.log('2');
  Promise.resolve().then(function() {
    console.log('3');
  }).then(res => {
    console.log(7)
  }).then(res => {
    console.log(8)
  })
}, 0);

Promise.resolve().then(function() {
  console.log('4');
  setTimeout(function() {
    console.log('5');
  }, 0);
});

console.log('6');