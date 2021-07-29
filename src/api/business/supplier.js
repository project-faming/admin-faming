
import request from '@/utils/request'

export function listSupplier(query) {
  return request({
    url: '/supplier/getList',
    method: 'post',
    params: query
  })
}
