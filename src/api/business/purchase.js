import request from '@/utils/request'

export function purchaseList(data) {
    return request({
        url: '/brandPurchase/getList',
        method: 'post',
        data
    })
}

export function changeOK(query) {
    return request({
        url: '/brandPurchase/changeOk',
        method: 'get',
        params:query
    })
}