<template>
    <div class="dashboard-container">
        <card-panel></card-panel>
        <!-- <cardHistogram></cardHistogram>
        <lineCharts></lineCharts>         -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cardPanel from '@/views/dashboard/cardPanel'
import lineCharts from '@/views/dashboard/lineCharts'
import cardHistogram from '@/views/dashboard/cardHistogram'

export default {
    name: 'Dashboard',
    components:{
        cardPanel,
        lineCharts,
        cardHistogram
    },
    computed: {
        ...mapGetters([
          'name'
        ])
    }
}
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
        overflow-y: scroll;
        min-height: 800px;
    }
}
</style>
