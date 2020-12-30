import config from '../config.js'
const URL = config.host+':'+config.apiPort

import {getToken} from '../utils/auth.js'

export function getQuestionList(type,page) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/testPapers',
             method:'GET',
             header:{
                 'token':TOKEN
             },
             data:{
               type,
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

export function getQuestions(data) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/testPaper',
             method:'GET',
             header:{
                 'token':TOKEN
             },
             data:data,
             success(res) {
                 resolve(res.data)
             },
             fail(err) {
                 reject(err)
             }
        })
    })
}

export function getRecords(page) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/testRecords',
             method:'GET',
             data:{
                page
             },
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

export function submitScore(test_paper_id,score) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.request({
             url:URL+'/api/testRecord',
             method:'POST',
             header:{
                 'token':TOKEN,
                 'content-type':'application/x-www-form-urlencoded'
             },
             data:{
                test_paper_id,
                score
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




