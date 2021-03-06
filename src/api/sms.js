import request from '@/utils/request'
import qs from 'qs'

/**
 * 发送短信
 * @param {*} data : String phones, String contactIds, String contactGroupIds, String message
 */
export function sendSms(data) {
  return request({
    url: '/smsSend',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 查询订单
 * @param {*} data ： int page , int limit , Integer orderId
 */
export function ordersQuery(data) {
  console.log('ordersQuery data=')
  console.log(data)
  return request({
    url: '/ordersQuery',
    method: 'post',
    data: qs.stringify(data)
  })
}
/**
 * 查询短信明细
 * @param {*} data :  int page , int limit, String phone, Integer orderId
 */
export function smslistQuery(data) {
  return request({
    url: '/smslistQuery',
    method: 'post',
    data: qs.stringify(data)
  })
}
/**
 * 获取短信签名
 * @param {d} data
 */
export function signQuery(data) {
  return request({
    url: '/smsSignQuery',
    method: 'post',
    data: qs.stringify(data)
  })
}
