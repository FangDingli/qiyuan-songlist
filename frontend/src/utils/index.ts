export class Debounced {

  /**
   *
   * @param fn 要执行的函数
   * @param delay  时间
   * @param immediate 是否在触发事件后立即执行
   */
  static use(fn: Function, delay: number = 1000, immediate: boolean = false) {
    let timer: NodeJS.Timeout | null
    return (...args: any) => {
      if (timer) clearInterval(timer)
      if (immediate) {
        if (!timer) fn.apply(this, args);
        timer = setTimeout(function () {
          timer = null;
        }, delay)
      } else {
        timer = setTimeout(() => { fn.apply(this, args) }, delay)
      }
    }
  }

}

export class Throttle {
  /**
   * 
   * @param fn 
   * @param delay 
   * @param immediate true 是启用时间戳版，false 是启用定时器版，作用一样
   */
  static use(fn: Function, delay: number = 1000, immediate: boolean = true) {
    //时间戳
    if (immediate) {
      let prevTime = 0;
      return (...args: any) => {
        let nowTime = Date.now();
        if (nowTime - prevTime >= delay) {
          fn.apply(this, args)
          prevTime = nowTime
        }
      }
    } else {
      //定时器
      let timer: NodeJS.Timeout | null;
      return (...args: any) => {
        if (!timer) {
          fn.apply(this, args)
          timer = setTimeout(() => {
            timer && clearTimeout(timer)
            timer = null
          }, delay);
        }

      }
    }
  }
}

export const getRandomNum = (min: number, max: number): number => {
  const range = max - min
  const rand = Math.random()
  const number = min + Math.round(rand * range)

  return number
}