<template>
    <div class="app-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
            <el-input v-model="listQuery.name"
                      clearable
                      size="mini"
                      class="filter-item"
                      style="width: 200px;"
                      placeholder="请输入商品名称" />
            <el-button class="filter-item"
                       size="mini"
                       type="primary"
                       icon="el-icon-search"
                       @click="handleFilter">查找</el-button>
            <el-button class="filter-item"
                       size="mini"
                       type="primary"
                       icon="el-icon-edit"
                       v-permission="['POST /admin/supplier/create']"
                       @click="handleCreate">新建</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table v-loading="listLoading"
                  :data="list"
                  size="small"
                  element-loading-text="正在查询中。。。"
                  border
                  fit
                  highlight-current-row>

            <el-table-column align="center"
                             label="商品ID"
                             prop="productId" />
            <el-table-column align="center"
                             label="商品名称"
                             show-overflow-tooltip
                             prop="productName" />
            <el-table-column align="center"
                             label="商品价格"
                             prop="productPrice" />
            <el-table-column align="center"
                             label="商品库存"
                             prop="productSku" />
            <el-table-column align="center"
                             label="采购数量"
                             prop="supplierOne" />
            <el-table-column align="center"
                             label="采购单价"
                             prop="supplierPrice" />
            <el-table-column align="center"
                             label="采购总价"
                             prop="supplierTotalPrice" />
            <el-table-column align="center"
                             label="状态">
                <template slot-scope="scope">
                    <span>{{statusData[scope.row.status]}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="结算日"
                             prop="applyDay" />
            <el-table-column align="center"
                             label="创建时间"
                             prop="addTime" />
            <el-table-column align="center"
                             label="操作"
                             width="200"
                             class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary"
                               size="mini"
                               style="width:80px"
                               v-permission="['GET /admin/supplier/changeStatus']"
                               @click="handleChangeStatus(scope.row)">状态修改</el-button>
                    <el-button type="danger"
                               size="mini"
                               v-permission="['GET /admin/supplier/delete']"
                               @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0"
                    :total="total"
                    :page.sync="listQuery.page"
                    :limit.sync="listQuery.limit"
                    @pagination="getList" />

        <el-tooltip placement="top"
                    content="返回顶部">
            <back-to-top :visibility-height="100" />
        </el-tooltip>
        <supplier-edit v-if="editStatus"
                       v-model="editStatus"
                       :edit="edit"
                       :statusData="statusData"
                       @refechList="handleFilter" />
        <change-status v-if="statusFlag"
                       v-model="statusFlag"
                       :id="detail.id"
                       :status="detail.status"
                       :statusData="statusData"
                       @refechList="getList"></change-status>
    </div>
</template>
<script>
    import { listSupplier, supplierDelete } from '@/api/business/supplier'
    import BackToTop from '@/components/BackToTop'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import SupplierEdit from './supplier-edit.vue'
    import ChangeStatus from './change-status.vue'
    export default {
        name: 'ArticleList',
        components: { BackToTop, Pagination, SupplierEdit, ChangeStatus },
        data() {
            return {
                list: [],
                total: 0,
                listLoading: true,
                editStatus: false,
                edit: '',
                statusFlag: false,
                listQuery: {
                    page: 1,
                    limit: 20,
                    name: '',
                },
                detail: {},
                statusData: {
                    1: '待供应商确认',
                    2: '供应商已确认-采购中',
                    3: '采购完成-平台未打款',
                    4: '平台已打款'
                }
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.listLoading = true
                console.log(this.listQuery)
                listSupplier(this.listQuery).then(response => {
                    this.list = response.data.data.list
                    this.total = response.data.data.total
                    this.listLoading = false
                }).catch(() => {
                    this.list = []
                    this.total = 0
                    this.listLoading = false
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            handleCreate() {
                this.editStatus = true
                this.edit = 'newForm'
            },
            handleChangeStatus(row) {
                this.statusFlag = true
                this.detail = row
            },
            handleDelete(row) {
                supplierDelete({
                    id: row.id
                }).then(response => {
                    this.$notify.success({
                        title: '成功',
                        message: '删除成功'
                    })
                    this.handleFilter()
                }).catch(response => {
                    this.$notify.error({
                        title: '失败',
                        message: response.data.errmsg
                    })
                })
            }
        }
    }
</script>
<style>
    .table-expand {
        font-size: 0;
    }
    .table-expand label {
        width: 100px;
        color: #99a9bf;
    }
    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
    }
    .gallery {
        width: 80px;
        margin-right: 10px;
    }
</style>
