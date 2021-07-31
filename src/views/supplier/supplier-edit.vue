<template>
    <el-dialog :visible.sync="currentValue"
               :title="getTitle"
               width="70%">
        <section class="supplier-detail">
            <el-form size="mini"
                     label-position="right"
                     class="supplier-detail-form"
                     :model="formData"
                     ref="ruleForm"
                     :rules="rules"
                     label-width="150px">
                <el-form-item label="商品"
                              prop="productId">
                    <el-select :placeholder="'请选择渠道'"
                               clearable
                               name="project"
                               style="width: 100%"
                               filterable
                               remote
                               v-loadmore="loadMore"
                               :remote-method="remoteMethod"
                               v-model="formData.productId">
                        <el-option v-for="item in position"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品价格"
                              prop="productPrice">
                    <el-input v-model="formData.productPrice">
                        <template slot="append">元</template>
                    </el-input>

                </el-form-item>
                <el-form-item label="商品库存"
                              prop="productSku">
                    <el-input v-model="formData.productSku"></el-input>
                </el-form-item>
                <el-form-item label="采购数量"
                              prop="supplierOne">
                    <el-input v-model="formData.supplierOne"></el-input>
                </el-form-item>
                <el-form-item label="采购单价"
                              prop="supplierPrice">
                    <el-input v-model="formData.supplierPrice">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="采购总价">
                    <el-input :disabled="true"
                              v-model="supplierTotalPrice">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="状态"
                              prop="status">
                    <el-select v-model="formData.status"
                               style="width: 100%">
                        <el-option v-for="(item,key) in statusData"
                                   :key="key"
                                   :label="item"
                                   :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结算申请日"
                              prop="applyDay">
                    <el-input v-model="formData.applyDay"></el-input>
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
    import { listGoods } from '@/api/business/goods'
    import { supplierCreate } from '@/api/business/supplier'
    export default {
        mixins: [twoWay],
        props: {
            edit: {
                type: String,
                default: ''
            },
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            var priceReg = /^\d+(.\d{1,2})?$/;
            var numReg = /^\d+$/;
            var productPriceValidator = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入精确到小数点两位的数字'));
                } else {
                    if (!priceReg.test(Number(value))) {
                        callback(
                            new Error("请输入精确到小数点两位的数字")
                        );
                    } else {
                        callback();
                    }
                }
            }
            var productSkuValidator = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入整数'));
                } else {
                    if (!numReg.test(Number(value))) {
                        callback(
                            new Error("请输入整数")
                        );
                    } else {
                        callback();
                    }
                }
            }

            return {
                formData: {
                    productId: '',
                    productPrice: '',
                    productSku: '',
                    status: '',
                    supplierOne: '',
                    supplierPrice: '',
                    supplierTotalPrice: '',
                    applyDay: ''
                },
                rules: {
                    productId: [
                        { required: true, message: '请选择商品', trigger: 'change' }
                    ],
                    productPrice: [
                        { required: true, validator: productPriceValidator, trigger: 'change' }
                    ],
                    productSku: [
                        { required: true, validator: productSkuValidator, trigger: 'change' }
                    ],
                    supplierOne: [
                        { required: true, validator: productSkuValidator, trigger: 'change' }
                    ],
                    supplierPrice: [
                        { required: true, validator: productPriceValidator, trigger: 'change' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                    applyDay: [
                        { required: true, validator: productSkuValidator, trigger: 'change' }
                    ],
                },
                position: [],
                listInite: [],
                getAll: false,
                currentPage: 1,
                statusData: {
                    1: '待供应商确认',
                    2: '供应商已确认，采购中',
                    3: '采购完成，为结款',
                    4: '已借款'
                }
            }
        },
        computed: {
            getTitle() {
                return this.edit === 'newForm' ? '新建' : '编辑'
            },
            supplierTotalPrice() {
                let totalPrice = 0
                if (this.formData.supplierOne && this.formData.supplierPrice) {
                    let buyPrice = Number(this.formData.supplierPrice)
                    let buyNum = Number(this.formData.supplierOne)
                    if (typeof buyPrice === 'number' && typeof buyNum === 'number') {
                        totalPrice = ((buyPrice * buyNum) * 100 / 100).toFixed(2)
                    } else {
                        totalPrice = 0
                    }
                } else {
                    totalPrice = 0
                }
                return totalPrice
            }
        },
        created() {
            if (this.edit === '编辑') {
                this.formData.channel_info = `${this.id}_${this.id}`
            }
        },
        mounted() {
            this.loadList({});
        },
        methods: {
            handleQuery() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        const params = { ...this.formData }
                        params.supplierTotalPrice = this.supplierTotalPrice
                        console.log(params);
                        supplierCreate(params).then(() => {
                            this.$notify.success({
                                title: '成功',
                                message: '创建成功'
                            })
                            this.$emit('refechList')
                        }).catch(response => {
                            this.$notify.error({
                                title: '失败',
                                message: response.data.errmsg
                            })
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
            searchData(query) {
                this.loadList(query);
            },
            async loadList(params) {
                const that = this;
                const { currentPage } = params;

                const { data } = await listGoods({
                    page: this.currentPage,
                    limit: 10,
                })
                console.log(data);
                if (data) {
                    const list = data.data.items.map((it) => ({
                        value: it.id,
                        label: it.name,
                    }));
                    that.listInite = that.listInite.concat(list);
                    that.position = that.listInite;
                }
                console.log(that.position);
                if (that.listInite.length >= data.data.total) {
                    //已获取全部数据标志，当已获取全部数据时，不再访问接口拉取数据。
                    that.getAll = true;
                }

            },
            loadMore() {
                this.currentPage = this.currentPage + 1;
                if (!this.getAll) {
                    this.loadList({});
                }
            }
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
