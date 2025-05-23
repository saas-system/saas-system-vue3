import baTableClass from '/@/utils/baTable'
import type { baTableApi } from '/@/api/common'
import { getTableFieldList } from '/@/api/common'
import { add } from '/@/api/backend/security/sensitiveData'
import { uuid } from '/@/utils/random'

export interface DataFields {
    name: string
    value: string
}

export class sensitiveDataClass extends baTableClass {
    constructor(api: baTableApi, table: BaTable, form: BaTableForm = {}, before: BaTableBefore = {}, after: BaTableAfter = {}) {
        super(api, table, form, before, after)
    }

    // 重写编辑
    getEditData = (id: string) => {
        this.form.loading = true
        this.form.items = {}
        return this.api.edit({ id: id }).then((res) => {
            const fields: string[] = []
            const dataFields: DataFields[] = []
            for (const key in res.data.row.data_fields) {
                fields.push(key)
                dataFields.push({
                    name: key,
                    value: res.data.row.data_fields[key] ?? '',
                })
            }

            this.form.items!.connection = res.data.row.connection ? res.data.row.connection : ''
            this.form.extend!.controllerList = res.data.controllers

            if (res.data.row.data_table) {
                this.onTableChange(res.data.row.data_table)
                if (this.form.extend!.parentRef) this.form.extend!.parentRef.setDataFields(dataFields)
            }

            res.data.row.data_fields = fields
            this.form.loading = false
            this.form.items = res.data.row
        })
    }

    onConnectionChange = () => {
        this.form.extend!.fieldList = {}
        this.form.extend!.fieldSelect = {}
        this.form.extend!.fieldSelectKey = uuid()

        this.form.items!.data_table = ''
        this.form.items!.data_fields = []
        if (this.form.extend!.parentRef) this.form.extend!.parentRef.setDataFields([])
    }

    // 数据表改变事件
    onTableChange = (table: string) => {
        this.form.extend = Object.assign(this.form.extend!, {
            fieldLoading: true,
            fieldList: {},
            fieldSelect: {},
            fieldSelectKey: uuid(),
        })

        this.form.items!.data_fields = []
        if (this.form.extend!.parentRef) this.form.extend!.parentRef.setDataFields([])

        getTableFieldList(table, true, this.form.items!.connection).then((res) => {
            this.form.items!.primary_key = res.data.pk
            this.form.defaultItems!.primary_key = res.data.pk

            const fieldSelect: anyObj = {}
            for (const key in res.data.fieldList) {
                fieldSelect[key] = (key ? key + ' - ' : '') + res.data.fieldList[key]
            }

            this.form.extend = Object.assign(this.form.extend!, {
                fieldLoading: false,
                fieldList: res.data.fieldList,
                fieldSelect: fieldSelect,
                fieldSelectKey: uuid(),
            })
        })
    }

    /**
     * 重写打开表单方法
     */
    toggleForm = (operate = '', operateIds: string[] = []) => {
        if (this.form.ref) {
            this.form.ref.resetFields()
        }

        if (this.form.extend!.parentRef) this.form.extend!.parentRef.setDataFields([])

        if (operate == 'Edit') {
            if (!operateIds.length) {
                return false
            }
            this.getEditData(operateIds[0])
        } else if (operate == 'Add') {
            this.form.loading = true
            add().then((res) => {
                this.form.extend!.controllerList = res.data.controllers
                this.form.items = Object.assign({}, this.form.defaultItems)
                this.form.loading = false
            })
        }

        this.form.operate = operate
        this.form.operateIds = operateIds
    }
}
