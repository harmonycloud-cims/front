import moment from 'moment';

export const fn = {
  /**
   * 频率控制函数， fn执行次数不超过 1 次/delay
   * @param fn{Function}     传入的函数
   * @param delay{Number}    时间间隔
   * @param options{Object}  如果想忽略开始边界上的调用则传入 {leading:false},
   *                         如果想忽略结束边界上的调用则传入 {trailing:false},
   * @returns {Function}     返回调用函数
   */
  throttle(fn, delay, options) {
    let wait = false;
    if (!options) options = {};
    return function() {
      const args = arguments;
      if (!wait) {
        if (!(options.leading === false)) {
          fn.apply(this, args);
        }
        wait = true;
        setTimeout(() => {
          if (!(options.trailing === false)) {
            fn.apply(this, args);
          }
          wait = false;
        }, delay);
      }
    };
  },
  /**
   * debounce
   * @param fn{Function}     传入的函数
   * @param delay{Number}    时间间隔
   * @returns {Function}     返回调用函数
   */
  debounce(fn, delay = 1000) {
    let timer;
    let context = this;
    return function() {
      if (timer) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(context, arguments);
        }, delay);
      } else {
        timer = setTimeout(() => {
          fn.apply(context, arguments);
        }, delay);
      }
    };
  }
};
export const getCookie = (name) => {
    let arr = document.cookie.match(new RegExp('(^| )'+name+'=([^;]*)(;|$)'));
    if(arr) return unescape(arr[2]); return null;
};
//删除cookie
export const delCookie = (name) => {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if(cval) document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
};
export const caluDate = (date) => {
  let first = `01 ${date}`;
  let start = 1;
  let numberWeek = parseInt(moment(first, 'DD MMM YYYY').format('d'), 10);
  let last = moment(first, 'DD MMM YYYY').add(1, 'months').subtract(1, 'days').format('D');
  let dateList = [];
  if(numberWeek === 0) {
    start = 2;
    numberWeek = 1;
  } else if (numberWeek === 6) {
    start = 3;
    numberWeek = 1;
  }
  for(let i=0; i<=(last-start); i++) {
    if ( !((((i+numberWeek)%7) === 6) || (((i+numberWeek)%7) === 0)) ) {
      dateList.push(start + i);
    }
  }
  return {dateList, numberWeek};
};