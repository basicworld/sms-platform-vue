import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  console.log('api.user login date=')
  console.log(data)
  return request({
    url: '/userLogin',
    method: 'post',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
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
