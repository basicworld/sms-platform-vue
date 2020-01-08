import request from '@/utils/request'
import qs from 'qs'

/**
 * 新建
 * @param {d} data
 */
export function addContactGroup(data) {
  return request({
    url: '/contactgroup/add',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * list group
 * @param {d} data
 */
export function listContactGroup(data) {
  return request({
    url: '/contactgroup/list',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * update group
 * @param {d} data
 */
export function updateContactGroup(data) {
  return request({
    url: '/contactgroup/update',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * delete group
 * @param {d} data
 */
export function deleteContactGroup(data) {
  return request({
    url: '/contactgroup/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}
