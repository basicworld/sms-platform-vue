import request from '@/utils/request'
import qs from 'qs'
/**
 * 新建联系人
 * @param {d} data
 */
export function addContact(data) {
  return request({
    url: '/contact/add',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 新建联系人
 * @param {d} data
 */
export function uniquePhoneCheck(data) {
  return request({
    url: '/contact/uniphone',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 查询联系人
 * @param {d} data
 */
export function listContact(data) {
  return request({
    url: '/contact/list',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 更新联系人
 * @param {d} data
 */
export function updateContact(data) {
  return request({
    url: '/contact/update',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 删除联系人
 * @param {d} data
 */
export function deleteContact(data) {
  return request({
    url: '/contact/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}

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
