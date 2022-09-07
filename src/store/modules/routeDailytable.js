const state = {
    query:{
        groupName:'',
        routeName:'',
        workdate:''
    },
    showQueryDialog:false,
}

const mutations = {
    CHANGE_QUERY(state,{groupName,routeName,workdate}){
        console.log(groupName,routeName,workdate)
        state.query.routeName = routeName;
        state.query.workdate = workdate;
        state.query.groupName = groupName;
    },
    SHOW_ROUTE_DAILY_TABLE_DIALOG(state,value){
        state.showQueryDialog = value;
    }
}

const actions = {
    showRouteDailyTableDialog({commit},value){
        commit('SHOW_ROUTE_DAILY_TABLE_DIALOG',value)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}