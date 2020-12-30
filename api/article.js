import config from '../config.js'
const URL = config.host+':'+config.apiPort

import {getToken} from '../utils/auth.js'

export function getCategories() {
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/categories',
             method:'GET',
             success(res) {
                 resolve(res.data)
             },
             fail(err) {
                 reject(err)
             }
        })
    })
}

export function getArticles(page,categoryId) {
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/articles',
             method:'GET',
             data:{
                 page,
                 category_id:categoryId
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
export function getArtcileDetail(id) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/article',
             method:'GET',
             header:{
                 'token':TOKEN
             },
             data:{
                 id
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
export function getFavoriteArtciles(page) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/userFavorites',
             method:'GET',
             header:{
                 'token':TOKEN
             },
             data:{
                 page
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

export function addFavorite(id) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/userFavorites',
             method:'POST',
             header:{
                 'token':TOKEN,
                 'content-type':'application/x-www-form-urlencoded'
             },
             data:{
                 article_id:id
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

export function deleteFavorite(id) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/deleteFavorite',
             method:'POST',
             header:{
                 'token':TOKEN,
                 'content-type':'application/x-www-form-urlencoded'
             },
             data:{
                 article_id:id
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

export function getComments(id,page=1) {
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/comments',
             method:'GET',
             data:{
                 article_id:id,
                 page
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

export function submitComment(id,content) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/comment',
             method:'POST',
             header:{
                 'token':TOKEN,
                 'content-type':'application/x-www-form-urlencoded'
             },
             data:{
                 article_id:id,
                 content
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