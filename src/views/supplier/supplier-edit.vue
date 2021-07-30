<template>
    <el-dialog :visible.sync="currentValue"
               :title="getTitle"
               width="70%">
        <section class="supplier-detail">
            <form size="mini"
                  label-position="right"
                  label-width="150px">
                <el-form-item label="会员ID">
                    <el-select :placeholder="'请选择渠道'"
                               clearable
                               name="project"
                               style="width: 100%"
                               filterable
                               remote
                               :remote-method="remoteMethod"
                               v-loadmore="loadMore"
                               v-model="formData.channel_info">
                        <el-option v-for="item in position"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="`${item.label}_${item.value}`">
                        </el-option>
                    </el-select>
                </el-form-item>
            </form>
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
                getAll: false
            }
        },
        computed: {
            getTitle() {
                return this.edit === 'newForm' ? '新建' : '编辑'
            }
        },
        mounted() {
            if (this.edit === '编辑') {
                this.formData.channel_info = `${this.id}_${this.id}`
            }

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
                try {
                    // const { code, data } = await this.$request("channel_lists", {
                    //     page: this.currentPage,
                    //     page_size: 10,
                    // });

                    const { code, data } = await listGoods({
                        page: this.currentPage,
                        page_size: 10,
                    })
                    if (data) {
                        const list = data.list.map((it) => ({
                            value: it.id,
                            label: it.channel_name,
                        }));
                        that.listInite = that.listInite.concat(list);
                        that.position = that.listInite;
                    }
                    if (that.listInite.length >= data.total) {
                        //已获取全部数据标志，当已获取全部数据时，不再访问接口拉取数据。
                        that.getAll = true;
                    }
                } catch {
                    console.log("bug");
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
