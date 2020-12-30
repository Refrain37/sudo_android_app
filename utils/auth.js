const TOKEN = 'token'
const USERINFO = 'userinfo'

export function setToken(val) {
    if(!val) {
        return
    }
    uni.setStorageSync(TOKEN,val)
}

export function getToken() {
   const token = uni.getStorageSync(TOKEN)
   return token
}

export function removeToken() {
    uni.removeStorageSync(TOKEN)
}

export function setUserInfo(info) {
    if(!info) {
        return
    }
    uni.setStorageSync(USERINFO, JSON.stringify(info))
}

export function getUserInfo() {
    const userInfo = uni.getStorageSync(USERINFO)
    return JSON.parse(userInfo)
}

export function removeUserInfo() {
    uni.removeStorageSync(USERINFO)
}