<template>
	<div class="">
		<!-- 查询结果 -->
		<el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row>
			<el-table-column align="center" width="100px" label="记录ID" prop="id" sortable/>
			<el-table-column align="center" label="商品名称">
				<template slot-scope="scope">
					<span style="color: #1e6abc;cursor: pointer" @click="$router.push({path:'/goods/list',query:{'goodsName':scope.row.goodsName}})">{{scope.row.goodsName}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="商品ID" prop="goodsId"/>
			<el-table-column align="center" label="采购数量" prop="total"/>
			<el-table-column align="center" label="采购价格" prop="goodsPrice"/>
			<el-table-column align="center" label="审批状态">
				<template slot-scope="scope">
					<span v-if="scope.row.type === 1">未审批</span>
					<span v-if="scope.row.type === 2">已审批</span>
					<span v-if="scope.row.type === 3">审核未通过</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="审批备注" prop="traceMsg"/>
			<el-table-column align="center" label="操作" width="120" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button v-if="scope.row.type === 1" type="primary" size="mini" @click="handleApprove(scope.row)">审批</el-button>
					<el-button v-if="scope.row.type === 2" type="info" size="mini" >已审批</el-button>
					<el-button v-if="scope.row.type === 3" type="info" size="mini">审核未通过</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
		<!-- 审批窗口 -->
		<el-dialog :visible.sync="approveDialogVisible" title="采购审核">
			<el-form ref="approveForm" :rules="rules" :model="approveForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
				<el-form-item label="是否通过" prop="type">
					<el-radio-group v-model="approveForm.type">
						<el-radio :label="2">通过</el-radio>
						<el-radio :label="3">拒绝</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="approveDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="confirmApprove">审批</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import { purchaseList,changeOK } from '@/api/business/purchase'
    export default {
        components: { Pagination },
        name: "purchase",
        data(){
            return{
                list: null,
                total: 0,
                listLoading: true,
                approveDialogVisible:false,
                approveForm: {
                    id: undefined,
                    type: undefined,
                },
                rules: {
                    type: [
                        { required: true, message: '审核状态不能为空！', trigger: 'blur' }
                    ]
                },
                listQuery: {
                    page: 1,
                    limit: 20
                },
            }
        },
        created() {
            this.getList()
        },
        methods:{
            getList() {
                this.listLoading = true;
                purchaseList(this.listQuery).then((response) => {
                    this.list = response.data.data.list;
                    this.total = response.data.data.total;
                    this.listLoading = false
                }).catch(() => {
                    this.list = [];
                    this.total = 0;
                    this.listLoading = false;
                })
            },
            handleApprove(row){//审批弹框
                this.approveForm.id = row.id;
                this.approveDialogVisible = true;
            },
            confirmApprove(){//审批提交
                this.$refs['approveForm'].validate((valid) => {
                    if (valid) {
                        changeOK(this.approveForm).then((response)=>{
                            this.approveDialogVisible = false;
                            this.$notify.success({
                                title: '成功',
                                message: '审批通过'
                            });
                            this.getList()
                        }).catch((response)=>{
                            this.$notify.error({
                                title: '审批失败',
                                message: response.message
                            })
                        })
                    }
                })

            }
        }
    }
</script>

<style scoped>

</style>