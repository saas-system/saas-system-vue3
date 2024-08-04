import { defineStore } from 'pinia'
import type { SiteConfig } from '/@/stores/interface'

export const useSiteConfig = defineStore('siteConfig', {
    state: (): SiteConfig => {
        return {
            siteName: '',
            recordNumber: '',
            version: '',
            cdnUrl: '',
            apiUrl: '',
            upload: {
                mode: 'local',
            },
            headNav: [],
            initialize: false,
            userInitialize: false,
        }
    },
    actions: {
        dataFill(state: SiteConfig) {
            this.$state = state
        },
        setInitialize(initialize: boolean) {
            this.initialize = initialize
        },
        setUserInitialize(userInitialize: boolean) {
            this.userInitialize = userInitialize
        }
    },
})
