<template>
    <el-card shadow="always">
        <div slot="header" class="clearfix">
            <span>概览</span>
        </div>
        <div class="overview-box">
            <el-row class="panel-group">
                <el-col class="card-panel" :span="8">
                    <div class="card-panel-icon-wrapper">
                        <i class="el-icon-datacenter-licheng1 icon-size" style="color: #34bfa3;"></i>
                    </div>
                    <div class="card-panel-value-box">
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                总里程
                            </div>
                            <span class="card-panel-num" v-text="panel.totalMileages"></span>
                        </div>
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                营运里程
                            </div>
                            <span class="card-panel-num" v-text="panel.totalOperationMileage"></span>
                        </div>
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                非营运里程
                            </div>
                            <span class="card-panel-num" v-text="panel.totalNonOperationMileage"></span>
                        </div>
                    </div>
                </el-col>
                <el-col class="card-panel" :span="8">
                    <div class="card-panel-icon-wrapper">
                        <i class="el-icon-datacenter-xunhuan icon-size" style="color: #36a3f7;"></i>
                    </div>
                    <div class="card-panel-value-box">
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                电耗
                            </div>
                            <span class="card-panel-num" v-text="panel.totalCharges"></span>
                        </div>
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                油耗
                            </div>
                            <span class="card-panel-num" v-text="panel.totalFuels"></span>
                        </div>
                    </div>
                </el-col>
                <el-col class="card-panel" :span="8">
                    <div class="card-panel-icon-wrapper">
                        <i class="el-icon-datacenter-gongjiaoche icon-size" style="color: #f4516c;"></i>
                    </div>
                    <div class="card-panel-value-box">
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                车辆数
                            </div>
                            <span class="card-panel-num" v-text="panel.vehicles"></span>
                        </div>
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                司机数
                            </div>
                            <span class="card-panel-num" v-text="panel.drivers"></span>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row class="panel-group">
                <el-col class="card-panel" :span="8">
                    <div class="card-panel-icon-wrapper">
                        <i class="el-icon-money icon-size" style="color: #40c9c6;"></i>
                    </div>
                    <div class="card-panel-value-box">
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                营运收入
                            </div>
                            <span class="card-panel-num" v-text="panel.totalRenues"></span>
                        </div>
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                补贴收入
                            </div>
                            <span class="card-panel-num" v-text="panel.subsidyRenues"></span>
                        </div>
                    </div>
                </el-col>
                <el-col class="card-panel" :span="8">
                    <div class="card-panel-title" style="margin-top:10px; font-size:28px" v-text="queryForm.workdate">
                        
                    </div>
                    <div class="card-panel-title" style="font-size:26px" v-text="queryForm.routeName">
                        
                    </div>
                    <div class="card-panel-title" style="font-size:20px">
                        营运分析日报
                    </div>
                </el-col>
                <el-col class="card-panel" :span="8">
                    <div class="card-panel-icon-wrapper">
                        <i class="el-icon-s-grid icon-size" style="color: #9266f9;"></i>
                    </div>
                    <div class="card-panel-value-box">
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                总趟次
                            </div>
                            <span class="card-panel-num" v-text="panel.totalTrips"></span>
                        </div>
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                高峰趟次
                            </div>
                            <span class="card-panel-num" v-text="panel.busyTotalTrips"></span>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row class="panel-group">
                <el-col class="card-panel" :span="8">
                    <div class="card-panel-icon-wrapper">
                        <i class="el-icon-s-marketing icon-size" style="color: #9266f9;"></i>
                    </div>
                    <div class="card-panel-value-box">
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                平均趟收入
                            </div>
                            <span class="card-panel-num" v-text="panel.avgTripRenues"></span>
                        </div>
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                平均每车收入
                            </div>
                            <span class="card-panel-num" v-text="panel.avgVehicleRenuvens"></span>
                        </div>
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                每公里收入
                            </div>
                            <span class="card-panel-num" v-text="panel.avgKmRenues"></span>
                        </div>
                    </div>
                </el-col>

                <el-col class="card-panel" :span="8">
                    <div class="card-panel-icon-wrapper">
                        <i class="el-icon-user icon-size" style="color: #f4516c;"></i>
                    </div>
                    <div class="card-panel-value-box">
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                客流量
                            </div>
                            <span class="card-panel-num" v-text="panel.totalPersonflow"></span>
                        </div>
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                学生+爱心+老年卡人数
                            </div>
                            <span class="card-panel-num" v-text="panel.stuLoveseniorsCount"></span>
                        </div>
                    </div>
                </el-col>
                
                <el-col class="card-panel" :span="8">
                    <div class="card-panel-icon-wrapper">
                        <i class="el-icon-s-data icon-size" style="color: #34bfa3;"></i>
                    </div>
                    <div class="card-panel-value-box">
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                平均趟时长
                            </div>
                            <span class="card-panel-num" v-text="panel.avgRunningTime"></span>
                        </div>
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                最小趟时长
                            </div>
                            <span class="card-panel-num" v-text="panel.minRunningTime"></span>
                        </div>
                        <div class="card-panel-value">
                            <div class="card-panel-text">
                                最大趟时长
                            </div>
                            <span class="card-panel-num" v-text="panel.maxRunningTime"></span>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>

<script>

import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
import {getOverview} from '@/api/routeAnalysis'

export default {
    name: 'routeCardPancel',
    data(){
        return {
            panel:{
                vehicles:0,
                drivers:0,
                totalMileages:0,
                totalOperationMileage:0,
                totalNonOperationMileage:0,
                totalCharges:0.0,
                totalFuels:0.0,
                totalRenues:0,
                subsidyRenues:0,
                totalPersonflow:0,
                stuLoveseniorsCount:0,
                totalTrips:0,
                busyTotalTrips:0,
                avgTripRenues:0,
                avgKmRenues:0,
                avgRunningTime:0,
                minRunningTime:0,
                maxRunningTime:0
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
                this._getOverview();
            });
        },
        _getOverview(){
             getOverview(this.queryForm).then(resp => {
                if(REQ_SUCCESS == REQ_SUCCESS){
                    this.panel = resp.result;
                }
            });
        }
    }
}
</script>

<style scoped>
.panel-group .card-panel{
    height: 108px;
    cursor: pointer;
    font-size: 11px;
    position: relative;
    overflow: hidden;
    color: #666;
    margin: 0 0px;
    background: #fff;
    -webkit-box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
}
.overview-box .panel-group:first-child{
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
}
.overview-box .panel-group:last-child{
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
}

.panel-group .card-panel:first-child {
    border-right: 1px solid #cccccc;
    border-left: 1px solid #cccccc;
}
.panel-group .card-panel:last-child {
    border-right: 1px solid #cccccc;
    border-left: 1px solid #cccccc;
}

.panel-group .card-panel .card-panel-icon-wrapper {
    float: left;
    margin: 10px 0 0 0px;
    padding: 10px;
    -webkit-transition: all 0.38s ease-out;
    transition: all 0.38s ease-out;
    border-radius: 6px;
}
.card-panel-value-box{
     margin: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
}
.card-panel-value-box .card-panel-value{
    font-weight: bold;
}
.card-panel-value-box .card-panel-value .card-panel-text{
    line-height: 18px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    margin-bottom: 12px;
}
.card-panel-value-box .card-panel-value .card-panel-num{
    font-size: 18px;
}
.icon-size{
    font-size: 39px;
}
.card-panel-title {
    text-align: center;
    font-weight: bold;
}
</style>
