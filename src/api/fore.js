import request from '@/utils/request'

export function smsSendSummary(data) {
  return request({
    url: '/smsSendSummary',
    method: 'post',
    data
  })
}

// fore/sendreport
export function foreSendReport(data) {
  return request({
    url: '/fore/sendreport',
    method: 'post',
    data
  })
}

// fore/report
export function foreReport(data) {
  return request({
    url: '/fore/report',
    method: 'post',
    data
  })
}
