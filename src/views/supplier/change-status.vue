<template>
    <el-dialog :visible.sync="currentValue"
               title="状态修改"
               width="70%">
        <section class="supplier-detail">
            <el-form size="mini"
                     label-position="right"
                     class="supplier-detail-form"
                     :model="formData"
                     ref="ruleForm"
                     :rules="rules"
                     label-width="150px">
                <el-form-item label="状态"
                              prop="status">
                    <el-select v-model="formData.status"
                               clearable
                               style="width: 100%">
                        <el-option v-for="(item,key) in statusData"
                                   :key="key"
                                   :label="item"
                                   :value="key"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </section>
        <div slot="footer"
             class="dialog-footer">
            <el-button @click="currentValue = false">取 消</el-button>
            <el-button type="primary"
                       @click="handleQuery">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import twoWay from '@/mixins/two-way/two-way'
    import { supplierChangeStatus } from '@/api/business/supplier'
    export default {
        mixins: [twoWay],
        props: {
            status: {
                type: Number,
                default: ''
            },
            id: {
                type: Number,
                default: ''
            }
        },
        data() {

            return {
                formData: {
                    status: '',
                },
                rules: {
                    status: [
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                },
                statusData: {
                    1: '待供应商确认',
                    2: '供应商已确认，采购中',
                    3: '采购完成，为结款',
                    4: '已借款'
                }
            }
        },
        mounted() {
            this.formData.status = this.status && this.status.toString()
        },
        methods: {
            handleQuery() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        const params = {
                            status: this.formData.status && Number(this.formData.status),
                            id: this.id
                        }
                        supplierChangeStatus(params).then(() => {
                            this.$notify.success({
                                title: '成功',
                                message: '修改成功'
                            })
                            this.$emit('refechList')
                        }).catch(response => {
                            this.$notify.error({
                                title: '失败',
                                message: response.data.errmsg
                            })
                        }).finally(() => {
                            this.currentValue = false
                        })
                    }
                });
            },
            remoteMethod(query) {
                return;
                this.query = query;
                //如果搜索框是空的，就访问原始数据，否则从后台搜索
                if (query !== "") {
                    setTimeout(() => {
                        this.searchData(query);
                    }, 200);
                } else {
                    //userList就是select绑定的可选数据
                    this.position = [];
                }
            },
        }
    }
</script>
<style scoped>
    .supplier-detail {
        display: flex;
        width: 100%;
        justify-content: center;
    }
    .supplier-detail .supplier-detail-form {
        width: 80%;
    }
</style>
