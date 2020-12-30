import { getToken } from './auth.js'

// network status
const NONE = 'none'
const POOR = 'poor'
const NORMAL = 'normal'

/* check the user's status */
export function checkStatus(path) {
    const token = getToken()
    if(!token) {
        uni.showToast({
            position:'bottom',
            title:'还未登录，请先进行登录',
            icon:'none'
        })
        setTimeout(() => {
            uni.switchTab({
                url:path
            })
        },1000)
    }else {
        return true
    }
}

/* show error */
export function showError() {
    uni.showToast({
        icon:'none',
        title:'错误，请进行检查'
    })
}

/* check the network */
export function checkNetwork() {
    let networkStatus 
    
    uni.getNetworkType({
        success(res) {
            const {networkType} = res
            if(networkType === 'none') {
                uni.showToast({
                    icon:'none',
                    title:'当前无网络，请进行检查'
                })
                networkStatus = NONE
            }else if(networkType === '2g' || networkType === '3g') {
                 uni.showToast({
                     icon:'none',
                     title:'当前网络状态不佳'
                 })
                 networkStatus = POOR
            }else{
                networkStatus =  NORMAL
            }
        },
        fail() {
            networkStatus = NONE
            console.log('err');
        }
    })
    
    return networkStatus
}

/* time format */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}