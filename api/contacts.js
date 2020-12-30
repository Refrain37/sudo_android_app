import config from '../config.js'
const URL = config.host+':'+config.apiPort

import {getToken} from '../utils/auth.js'

export function getFriends() {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/friends',
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

export function searchFriend(name) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/searchUser',
             method:'POST',
             header:{
                 'token':TOKEN,
                 'content-type':'application/x-www-form-urlencoded'
             },
             data:{
                 name
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

export function addFriend(friendId) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/friend',
             method:'POST',
             header:{
                 'token':TOKEN,
                 'content-type':'application/x-www-form-urlencoded'
             },
             data:{
                 friend_id:friendId
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

export function deleteFriend(friendId) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/deleteFriend',
             method:'POST',
             header:{
                 'token':TOKEN,
                 'content-type':'application/x-www-form-urlencoded'
             },
             data:{
                 friend_id:friendId
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

