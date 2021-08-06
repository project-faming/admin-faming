
import request from '@/utils/request'

export function listSupplier(query) {
  return request({
    url: '/supplier/getList',
    method: 'get',
    params: query
  })
}


export function supplierCreate(data) {
  return request({
    url: '/supplier/create',
    method: 'post',
    data
  })
}
export function supplierDelete(query) {
  return request({
    url: '/supplier/delete',
    method: 'get',
    params: query
  })
}
export function supplierChangeStatus(query) {
  return request({
    url: '/supplier/changeStatus',
    method: 'get',
    params: query
  })
}
