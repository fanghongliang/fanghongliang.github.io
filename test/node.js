const { log } = console


let i = 0;

  function count() {

    // 做繁重的任务的一部分 (*)
    // do {
    //   i++;
    //   // progress.innerHTML = i;
    //   log(i)
    // } while (i % 1e3 != 0);

    // if (i < 1e7) {
    //   setTimeout(count);
    // }

    // for (i=0; i<1e6; i++) {
    //   i++
    //   log(i)
    // }

    // 做繁重的任务的一部分 (*)
    do {
      i++;
      // progress.innerHTML = i;
      log(i)
    } while (i % 1e3 != 0);

    if (i < 1e6) {
      queueMicrotask(count);
    }

  }

  // count();


  /***
   * 
   * 微宏任务
   * 
   */

  log('@@==start')

  setTimeout(() =>{
    log('@@==>1')
    setTimeout(() => {
      log('@@==>2')
    }, 1000)
  }, 3000)


  // 管道函数

function pipe(...functions) {
  return function(initialValue) {
      return functions.reduce((accumulator, currentFunction) => {
          return currentFunction(accumulator);
      }, initialValue);
  };
}

// 示例函数
const add1 = x => {
  log('step 1')
  return x + 1
}
const multiply2 = x => {
  log('step 2')
  return  x * 2
};
const subtract3 = x => {
  log('step 3')
  return x - 3

};

// 创建管道
const myPipe = pipe(add1, multiply2, subtract3);

// 使用管道
const result = myPipe(5); // ((5 + 1) * 2) - 3 = 9
console.log(result); // 输出: 9
