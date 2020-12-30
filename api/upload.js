import config from '../config.js'
const URL = config.host+':'+config.apiPort

import {getToken} from '../utils/auth.js'

export function upload(name, filePath, data = {}) {
    let TOKEN = getToken()
    return new Promise((resolve,reject) => {
        uni.uploadFile({
            url:URL+'/api/uploadAvatar',
            header:{
                'token':TOKEN
            },
            name,
            filePath,
            formData:data,
            success(res) {
                resolve(res.data)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}