import request from '@/utils/request'

export function smsSendSummary(data) {
  return request({
    url: '/smsSendSummary',
    method: 'post',
    data
  })
}
