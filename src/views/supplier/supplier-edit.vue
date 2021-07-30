<template>
    <el-dialog :visible.sync="currentValue"
               :title="getTitle"
               width="70%">
        <section class="supplier-detail">
            <el-form size="mini"
                     label-position="right"
                     label-width="150px">
                <el-form-item label="会员ID">
                    <!--  -->
                    <el-select :placeholder="'请选择渠道'"
                               clearable
                               name="project"
                               style="width: 100%"
                               filterable
                               remote
                               v-loadmore="loadMore"
                               :remote-method="remoteMethod"
                               v-model="formData.channel_info">
                        <el-option v-for="item in position"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="`${item.label}_${item.value}`">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </section>

    </el-dialog>
</template>
<script>
    import twoWay from '@/mixins/two-way/two-way'
    import { listGoods } from '@/api/business/goods'
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
            return {
                formData: {
                    channel_info: ''
                },
                position: [],
                listInite: [],
                getAll: false,
                currentPage: 1
            }
        },
        computed: {
            getTitle() {
                return this.edit === 'newForm' ? '新建' : '编辑'
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
</style>
