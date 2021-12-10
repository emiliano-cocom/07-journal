import state from '@/modules/daybook/store/journal/state'
import * as actions from '@/modules/daybook/store/journal/actions'
import * as mutations from '@/modules/daybook/store/journal/mutations'
import * as getters from '@/modules/daybook/store/journal/getters'

const journalModule = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
}

export default journalModule