<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['add', 'edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        width="50%"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate ? t(baTable.form.operate) : '' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form"
                :class="'ba-' + baTable.form.operate + '-form'"
                :style="'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'"
            >
                <el-form
                    v-if="!baTable.form.loading"
                    ref="formRef"
                    @submit.prevent=""
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                >
                    <FormItem :label="t('tenant.businessAdmin.name')" type="string" v-model="baTable.form.items!.name" prop="name" :placeholder="t('Please input field', { field: t('tenant.businessAdmin.name') })" />
                    <FormItem :label="t('tenant.businessAdmin.gender')" type="radio" v-model="baTable.form.items!.gender" prop="gender" :data="{ content: { 0: t('tenant.businessAdmin.gender 0'), 1: t('tenant.businessAdmin.gender 1'), 2: t('tenant.businessAdmin.gender 2') }, childrenAttr: { border: true }}" />
                    <FormItem :label="t('tenant.businessAdmin.mobile')" type="string" v-model="baTable.form.items!.mobile" prop="mobile" :placeholder="t('Please input field', { field: t('tenant.businessAdmin.mobile') })" />
                    <FormItem :label="t('tenant.businessAdmin.memo')" type="textarea" v-model="baTable.form.items!.memo" prop="memo" :placeholder="t('Please input field', { field: t('tenant.businessAdmin.memo') })" />
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth! / 1.8 + 'px)'">
                <el-button @click="baTable.toggleForm('')">{{ t('Cancel') }}</el-button>
                <el-button v-blur :loading="baTable.form.submitLoading" @click="baTable.onSubmit(formRef)" type="primary">
                    {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? t('Save and edit next item') : t('Save') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import type baTableClass from '/@/utils/baTable'
import FormItem from '/@/components/formItem/index.vue'
import type { ElForm, FormItemRule } from 'element-plus'
import { buildValidatorData } from '/@/utils/validate'

const formRef = ref<InstanceType<typeof ElForm>>()
const baTable = inject('baTable') as baTableClass

const { t } = useI18n()

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    name: [buildValidatorData({ name: 'required', title: t('tenant.businessAdmin.name') })],
    mobile: [buildValidatorData({ name: 'required', title: t('tenant.businessAdmin.mobile') }), buildValidatorData({ name: 'mobile', title: t('tenant.businessAdmin.mobile') })],
    gender: [buildValidatorData({ name: 'select', title: t('tenant.businessAdmin.gender') })],
})
</script>

<style scoped lang="scss"></style>
