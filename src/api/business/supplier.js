
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
export function supplierDelete(data) {
  return request({
    url: '/supplier/delete',
    method: 'post',
    data
  })
}
