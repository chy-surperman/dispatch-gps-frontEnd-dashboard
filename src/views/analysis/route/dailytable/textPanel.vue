<template>
    <el-card shadow="always">
        <div slot="header" class="clearfix">
            <span>分析简报</span>
        </div>
        <div class="overview-box">
            <p>
                1、完成运营最快的趟次为(
                驾驶员:<span v-text="panel.minRunningtimeWorkplan.driverName"></span>，
                耗时:<span v-text="panel.minRunningtimeWorkplan.runningTime"></span>分钟，
                趟次时间段为:<span v-text="panel.minRunningtimeWorkplan.departureTime"></span>-<span v-text="panel.minRunningtimeWorkplan.arrivalTime"></span>)，
                每趟次平均运营时长最少的驾驶员是<span v-text="panel.minAvgRuntimeDriver.driverName"></span>，
                该驾驶员全天每趟次平均运营时长为<span v-text="panel.minAvgRuntimeDriver.runningTime"></span>分钟，
                该线路全天每趟次平均运营时长为<span v-text="panel.avgRunningtime"></span>分钟，以上驾驶员可能存在驾驶安全风险。
            </p>

            <p>
                2、高峰时间段总共发出<span v-text="panel.busyTotalTrips"></span>个趟次，
                平峰时间段总共发出<span v-text="panel.idleTotalTrips"></span>个趟次，
                高峰时间段占比为<span v-text="panel.busyPercentage"></span>%,
                <span v-if="panel.busyPercentage >= 60 " >排班基本符合要求</span>
                <span v-if="panel.busyPercentage < 60" >
                    排班高峰趟次不足，应增加<span v-text="panel.addTripNum"></span>个高峰趟次。
                </span>
            </p>

            <p>
                3、百公里收入最高的驾驶员是<span v-text="panel.max100kmRevenueDriver.driverName"></span>，
                  最低的驾驶员是<span v-text="panel.min100kmRevenueDriver.driverName"></span>，
                  其中<span v-text="panel.low50HighestIncomeDriver100km"></span>个驾驶员收入低于最高收入的50%，
                  <span v-text="panel.more50HighestIncomeDriver100km"></span>个驾驶员收入高于最高收入的50%。
                  
                  <span v-for="driver in panel.low30HighestIncomeDriver100kmDrivers" :key="driver.driverName" v-text="driver.driverName"></span>
                  <span v-if="panel.low30HighestIncomeSize > 0">这几位驾驶员可能存在甩客丢站的情况。</span>
            </p>

            <p>
                4、单位运营时间收入最高的是驾驶员:<span v-text="panel.maxRevenueRuntimeRatioDriver.driverName"></span>，
                最低的驾驶员是:<span v-text="panel.minRevenueRuntimeRatioDriver.driverName"></span>,
                其中有<span v-text="panel.low1RevenueRuntimeRatio"></span>个驾驶员比值低于线路平均水平，
                <span v-text="panel.more1RevenueRuntimeRatio"></span>个驾驶员比值高于线路平均水平。
            </p>
        </div>
    </el-card>
</template>

<script>

import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
import {getOverviewText} from '@/api/routeAnalysis'

export default {
    name: 'routeTextPancel',
    data(){
        return {
            panel:{
                minRunningtimeWorkplan:{},
                minAvgRuntimeDriver:{},
                avgRunningtime:0,	//平均营运时长
                totalTrips:0,		//总趟次
                busyTotalTrips:0,	//高峰趟次
                idleTotalTrips:0,
                busyPercentage:0,
                busyIdleRatio:0,	//高峰/平峰趟次比
                //收入
                max100kmRevenueDriver:{},
                min100kmRevenueDriver:{},
                low50HighestIncomeDriver100km:0,
                more50HighestIncomeDriver100km:0,
                low30HighestIncomeSize:0,
                low30HighestIncomeDriver100kmDrivers:[],
                
                //收入营运时长比
                maxRevenueRuntimeRatioDriver:{},
                minRevenueRuntimeRatioDriver:{},
                low1RevenueRuntimeRatio:0,
                more1RevenueRuntimeRatio:0
            }
        }
    },
    created(){
        this.listenQueryChangeEvent();
    },
    computed:{
        queryForm(){
            let queryForm = this.$store.state.routeDailytable.query;
            return queryForm;
        }
    },
    methods:{
        listenQueryChangeEvent(){
            this.$EventBus.$on('route_daily_table_query_change',(event) => {
                this._getOverviewText();
            });
        },
        _getOverviewText(){
             getOverviewText(this.queryForm).then(resp => {
                if(REQ_SUCCESS == REQ_SUCCESS){
                    this.panel = resp.result;
                    this.panel.busyPercentage = this.panel.busyPercentage.toFixed(2);
                    this.panel.low30HighestIncomeSize = this.panel.low30HighestIncomeDriver100kmDrivers.length;
                }
            });
        }
    }
}
</script>

<style scoped>
    .overview-box {
        height: 395px;
    }
    .overview-box p {
        font-size: 19px;
    }
</style>
