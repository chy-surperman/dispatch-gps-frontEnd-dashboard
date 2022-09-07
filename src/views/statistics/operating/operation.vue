<template>
	<div class="schedule-wrap">
		<el-row class="schedule-panel">
			<el-row :gutter="20">
				<el-col :span="3">
					<el-select size="mini" v-model="select.groupName" @change="groupNameChange" placeholder="请选择大队">
				   		<el-option v-for="groupName in routeGroups" :key="groupName" :label="groupName" :value="groupName"></el-option>
			    	</el-select>
				</el-col>
				
                <el-col :span="4">
					<el-date-picker size="mini" v-model="select.workdate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
				</el-col>

				<el-col :span="2">
					<el-button type="primary" size="mini" @click="_getDailyReport">查询</el-button>
				</el-col>
                <el-col :span="2">
					<el-button type="primary" size="mini" @click="exportData">下载</el-button>
				</el-col>
		 	</el-row>

		 	<el-table v-loading="loading" max-height="500" size="small" :data="dataTables" align="center" highlight-current-row style="width: 100%">
                <el-table-column align="center" type="index" width="50"></el-table-column>
			    <el-table-column align="center" prop="date" label="日期" width="100"></el-table-column>
                <el-table-column align="center" prop="groupName" label="车队" width="40"></el-table-column>
                <el-table-column align="center" prop="routeName" label="线路" width="40"></el-table-column>
                <el-table-column align="center" prop="vehicleLevel" label="车辆级别" width="40"></el-table-column>
                <el-table-column align="center" prop="energy" label="燃料" width="40"></el-table-column>
                <el-table-column align="center" prop="vehicles" label="配车数" width="40"></el-table-column>
                <el-table-column align="center" prop="tripMileage" label="趟公里" width="40"></el-table-column>
                <el-table-column align="center" prop="trip" label="满趟" width="40"></el-table-column>
                <el-table-column align="center" prop="runVehicles" label="出车台次" width="40"></el-table-column>
                <el-table-column align="center" prop="runVehicleRate" label="出车率" width="40"></el-table-column>
                <el-table-column align="center" prop="receiveBox" label="收箱台次" width="40"></el-table-column>
                <el-table-column align="center" prop="reveiveBoxRate" label="收箱率" width="40"></el-table-column>
                <el-table-column align="center" label="营运收入">
                    <el-table-column align="center" label="计划收入">
                        <el-table-column align="center" prop="planTotalIncome" label="日累计"></el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="实际收入">
                        <el-table-column align="center" label="日累计">
                            <el-table-column align="center" prop="actuaLTotalIncome" label="实际收入"></el-table-column>
                            <el-table-column align="center" prop="cashIncome" label="其中现金收入" ></el-table-column>
                            <el-table-column align="center" prop="icCardIncome" label="其中IC卡收入"></el-table-column>
                            <el-table-column align="center" prop="icCardSubsidy" label="其中IC卡补贴" ></el-table-column>
                            <el-table-column align="center" prop="virtualCardIncome" label="其中虚拟卡收入"></el-table-column>
                            <el-table-column align="center" prop="virtualCardSubsidy" label="其中虚拟卡补贴" ></el-table-column> 
                            <el-table-column align="center" prop="alipayIncome" label="其中支付宝收入" ></el-table-column> 
                            <el-table-column align="center" prop="increaseOrdecrease" label="增减额" ></el-table-column> 
                        </el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="完成率">
                        <el-table-column align="center" prop="actualTotalIncomeRate" label="日累计" ></el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="趟值">
                        <el-table-column align="center" prop="planTripValue" label="计划趟值" width="40"></el-table-column>
                        <el-table-column align="center" prop="actualTripValue" label="实际趟值" width="40"></el-table-column>
                        <el-table-column align="center" prop="tripValueRate" label="完成率" width="40"></el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="元/公里">
                        <el-table-column align="center" prop="planPerKm" label="计划"></el-table-column>
                        <el-table-column align="center" prop="actualPerKm" label="实际"></el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="客流量">
                    <el-table-column align="center" label="日累计">
                        <el-table-column align="center" prop="totalPersonflow" label="客流量"></el-table-column>
                        <el-table-column align="center" label="其中">
                            <el-table-column align="center" prop="cashCount" label="现金消费人次"></el-table-column>
                            <el-table-column align="center" prop="alipayCount" label="支付宝人次"></el-table-column>
                            <el-table-column align="center" prop="virtualCardCount" label="虚拟卡人次"></el-table-column>
                            <el-table-column align="center" prop="icCardCount" label="IC卡消费人次（电子钱包）"></el-table-column>
                            <el-table-column align="center" prop="offsiteCount" label="IC卡消费人次（异地卡）"></el-table-column>
                            <el-table-column align="center" prop="adultsCount" label="IC卡消费人次（成人钱包）"></el-table-column>
                            <el-table-column align="center" prop="stuCount" label="IC卡消费人次（学生卡）"></el-table-column>
                            <el-table-column align="center" prop="employeeCount" label="IC卡消费人次（员工卡）"></el-table-column>
                            <el-table-column align="center" prop="employeeStuCount" label="IC卡消费人次（员工学生卡）"></el-table-column>
                            <el-table-column align="center" prop="seniorsCount" label="IC卡消费人次（老年卡）"></el-table-column>
                            <el-table-column align="center" prop="loveCardCount" label="IC卡人次（爱心卡）"></el-table-column>
                            <el-table-column align="center" prop="icTotalCount" label="IC卡总人次"></el-table-column>
                            <el-table-column align="center" prop="allICCardPersonflowRate" label="IC卡消费人次占消费总人次比率"></el-table-column>
                            <el-table-column align="center" prop="icCardHandlingFee" label="手续费"></el-table-column>
                        </el-table-column>
                    </el-table-column>    
                </el-table-column>
                <el-table-column align="center" label="营运公里">
                    <el-table-column align="center" label="计划公里">
                        <el-table-column align="center" prop="planMonthKm" label="月公里"></el-table-column>
                        <el-table-column align="center" prop="planDayKm" label="日累计"></el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="实际公里">
                        <el-table-column align="center" prop="actualDayKm" label="日累计"></el-table-column>
                        <el-table-column align="center" prop="actualPerVechileDayKm" label="公里/日车"></el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="完成率%">
                        <el-table-column align="center" prop="actualDayKmRate" label="日累计"></el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="运行趟次(趟)">
                    <el-table-column align="center" prop="vehicleTargetTrip" label="台车目标日趟次" width="40"></el-table-column>
                    <el-table-column align="center" label="总趟次">
                        <el-table-column align="center" prop="planRouteTotalTrip" label="拆后线路日总趟次"></el-table-column>
                        <el-table-column align="center" prop="actualRouteTotalTrip" label="实际"></el-table-column>
                        <el-table-column align="center" prop="totalTripRate" label="完成率"></el-table-column>
                    </el-table-column>
                    <el-table-column align="center" label="其中高峰趟次">
                        <el-table-column align="center" prop="busyPlanRouteTotalTrip" label="计划"></el-table-column>
                        <el-table-column align="center" prop="busyActualRouteTotalTrip" label="实际"></el-table-column>
                        <el-table-column align="center" prop="busyTotalTripRate" label="完成率"></el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="能耗">
                    <el-table-column align="center" prop="energyPlan" label="计划" width="40"></el-table-column>
                    <el-table-column align="center" prop="chargeActual" label="电耗实际" width="40"></el-table-column>
                    <el-table-column align="center" prop="chargeAvg100" label="百公里电耗" width="40"></el-table-column>
                    <el-table-column align="center" prop="fuelActual" label="油耗实际" width="40"></el-table-column>
                    <el-table-column align="center" prop="fuelAvg100" label="百公里油耗" width="40"></el-table-column>
                </el-table-column>
		 	</el-table>
		</el-row>
	</div>
</template>
<script>
    import {getRouteGroup,getRouteNames} from '@/api/common'
    import {getRouteOperationReport} from '@/api/statistics'
    import { getToken } from '@/utils/auth'
    import axios from 'axios'
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
	export default{
		name:"statistics-workplan-driver",
		data(){
			return {
				routeList:[],
                routeGroups:[],
                select:{
                    groupName:'',
                    workdate:'',
                    routeName:''
                },
                dataTables:[],
                loading:false,
				days:[]
			}
		},
		methods:{
			_getRouteNames(groupName){
				getRouteNames({groupName}).then(resp => {
					if(resp.code == REQ_SUCCESS){
						this.routeList = resp.result;
					}
				})
            },
            _getRouteGroup(){
                getRouteGroup().then(resp => {
                    if(resp.code == REQ_SUCCESS){
                        this.routeGroups = resp.result;
                    }
                });
            },
			_getDailyReport(){
                this.loading = true;
				getRouteOperationReport(this.select).then(resp => {
                    this.loading = false;
					if(resp.code == REQ_SUCCESS){
						this.dataTables = resp.result;
					}
				});
			},
			groupNameChange(val){
                this.select.groupName = val;
                this._getRouteNames(val);
            },
            exportData(){
				let url = baseURL + "/statistics/operating/download/operation?groupName=" + this.select.groupName + "&workdate=" + this.select.workdate;
				axios({
					method:'get',
			        url,
                    responseType:'blob',
                    headers:{
                        Authorization:getToken()
                    }
				}).then(data => {
					if(!data) {
						return;
					}
					let url = window.URL.createObjectURL(data.data);
			        let link = document.createElement('a');
			        link.style.display = 'none';
			        link.href = url;
			        let fileName = this.select.workdate + "_" + this.select.groupName + "营运日报.xlsx";
			        link.setAttribute('download', fileName);
			        document.body.appendChild(link);
			        link.click();
				})
			},
		},
		created(){
			this._getRouteGroup();
		}
	}
</script>

<style scoped>
	.schedule-wrap{
		height: 99%;
		background: #fff;
	}
	.schedule-header{
		padding-top: 10px;
		padding-left: 20px;
	}
	.meta-panel{
		padding: 20px 10px 0 10px; 
	}
	.grid-content {
		margin-top: 10px;
        border-radius: 4px;
  	}
  	.schedule-panel {
  		margin: 15px;
  	}
</style>