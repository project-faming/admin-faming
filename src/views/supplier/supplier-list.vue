<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        clearable
        size="mini"
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入商品名称" />
      <el-select
        v-model="listQuery.status"
        size="mini"
        class="filter-item"
        placeholder="请选择状态">
        <el-option
          :value="true"
          label="推荐" />
        <el-option
          :value="false"
          label="普通" />
      </el-select>
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter">查找</el-button>
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      size="small"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row>

      <el-table-column
        align="center"
        label="商品ID"
        prop="productId"/>
      <el-table-column
        align="center"
        label="商户名称"
        prop="productName" />
      <el-table-column
        align="center"
        label="商品名称"
        prop="title" />
      <el-table-column
        align="center"
        label="商品价格"
        prop="productPrice" />
      <el-table-column
        align="center"
        label="商品库存"
        prop="productSku" />
      <el-table-column
        align="center"
        label="采购数量"
        prop="supplierOne" />
      <el-table-column
        align="center"
        label="采购单价"
        prop="supplierPrice" />
      <el-table-column
        align="center"
        label="采购总价"
        prop="supplierTotalPrice" />
      <el-table-column
        align="center"
        label="状态"
        prop="status" />
      <el-table-column
        align="center"
        label="结算日"
        prop="applyDay" />
      <el-table-column
        align="center"
        label="创建时间"
        prop="addTime" />
      <el-table-column
        align="center"
        label="操作"
        width="200"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)">修改状态</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList" />

    <el-tooltip
      placement="top"
      content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>
    <supplier-edit
      v-if="editStatus"
      v-model="editStatus"
      :edit="edit"/>
  </div>
</template>
<script>
import { listSupplier } from '@/api/business/supplier'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SupplierEdit from './supplier-edit.vue'
export default {
  name: 'ArticleList',
  components: { BackToTop, Pagination, SupplierEdit },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      editStatus: false,
      edit: '',
      listQuery: {
        page: 1,
        limit: 20,
        title: '',
        status: ''
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
        this.list = response.data.data.items
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
    handleUpdate(row) {
      this.editStatus = true
      this.edit = 'editForm'
    },
    handleDelete(row) {
      deleteArticle(row).then(response => {
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
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
