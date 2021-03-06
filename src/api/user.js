import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  console.log(data)
  return request({
    url: '/userLogin',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 发送验证码
export function verifycodeSend(data) {
  return request({
    url: '/user/regcode/send',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 发送验证码
export function regist(data) {
  return request({
    url: '/user/regist',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function changePassword(data) {
  console.log(data)
  return request({
    url: '/userChangePassword',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token: token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
