import state from '@/modules/daybook/store/module-template/state'
import * as actions from '@/modules/daybook/store/module-template/actions'
import * as mutations from '@/modules/daybook/store/module-template/mutations'
import * as getters from '@/modules/daybook/store/module-template/getters'

const myCustomModule = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
}

export default myCustomModule