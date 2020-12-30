import config from '../config.js'
const URL = config.host+':'+config.apiPort

import {getToken} from '../utils/auth.js'

export function register(username,passwd) {
    return new Promise((resolve,reject) => {
        uni.request({
            url:URL+'/api/register',
            method:'POST',
            header:{
                'content-type':'application/x-www-form-urlencoded'
            },
            data:{
                name:username,
                passwd
            },
            success(res) {
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

export function login(username,passwd) {
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/login',
             method:'POST',
             header:{
                 'content-type':'application/x-www-form-urlencoded'
             },
             data:{
                 name:username,
                 passwd:passwd
             },
             success(res) {
                 resolve(res.data)
             },
             fail(err) {
                 reject(err)
             }
        })
    })
}

export function getUserinfo() {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/userInfo',
             method:'GET',
             header:{
                 'token':TOKEN
             },
             success(res) {
                 resolve(res.data)
             },
             fail(err) {
                 reject(err)
             }
        })
    })
}

export function changeUserinfo(avatar,introduction) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
            url:URL+'/api/userInfo',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'token':TOKEN
            },
            method:'POST',
            data:{
               avatar,
               introduction
            },
            success(res) {
                resolve(res.data)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}
