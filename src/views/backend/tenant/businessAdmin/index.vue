<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader :buttons="['refresh', 'add', 'comSearch', 'columnDisplay']" />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef" />

        <!-- 表单 -->
        <PopupForm />
    </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'
import { useI18n } from 'vue-i18n'
import PopupForm from './popupForm.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'

const { t } = useI18n()
const tableRef = ref()
const optButtons = defaultOptButtons(['edit', 'delete'])
const baTable = new baTableClass(
    new baTableApi('/admin/tenant.BusinessAdmin/'),
    {
        pk: 'id',
        column: [
            { label: t('tenant.businessAdmin.id'), prop: 'id', align: 'center', width: 70, operator: '=', sortable: 'custom' },
            { label: t('tenant.businessAdmin.name'), prop: 'name', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('tenant.businessAdmin.gender'), prop: 'gender', align: 'center', operator: '=', render: 'tag', custom: { '0': 'info', '1': '', '2': 'success' }, replaceValue: { 0: t('tenant.businessAdmin.gender 0'), 1: t('tenant.businessAdmin.gender 1'), 2: t('tenant.businessAdmin.gender 2') } },
            { label: t('tenant.businessAdmin.mobile'), prop: 'mobile', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('tenant.businessAdmin.memo'), prop: 'memo', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('tenant.businessAdmin.create_time'), prop: 'create_time', align: 'center', render: 'datetime', operator: 'RANGE', sortable: 'custom', width: 160, timeFormat: 'yyyy-mm-dd hh:MM:ss' },
            { label: t('operate'), align: 'center', width: 100, render: 'buttons', buttons: optButtons, operator: false },
        ],
        dblClickNotEditColumn: [undefined],
    }
)

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getIndex()?.then(() => {
        baTable.initSort()
        baTable.dragSort()
    })
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'tenant/businessAdmin',
})
</script>

<style scoped lang="scss"></style>
