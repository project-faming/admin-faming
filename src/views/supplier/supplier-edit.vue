<template>
  <el-dialog
    :visible.sync="currentValue"
    :title="getTitle"
    width="70%">
    <section class="supplier-detail">
      <form
        size="mini"
        label-position="right"
        label-width="150px">
        <el-form-item label="会员ID">
          会员ID
        </el-form-item>
      </form>
    </section>

  </el-dialog>
</template>
<script>
import twoWay from '@/mixins/two-way/two-way'
export default {
  mixins: [twoWay],
  props: {
    edit: {
      type: String,
      default: ''
    }
  },
  computed: {
    getTitle() {
      return this.edit === 'newForm' ? '新建' : '编辑'
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
