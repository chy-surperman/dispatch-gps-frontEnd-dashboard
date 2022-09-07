<template>
	<div class="schedule-wrap">
		<el-row class="schedule-panel">
			<el-row :gutter="20">
				<el-col :span="3">
					<el-select size="mini" v-model="select.groupName" @change="groupNameChange" placeholder="请选择大队">
				   		<el-option v-for="groupName in routeGroups" :key="groupName" :label="groupName" :value="groupName"></el-option>
			    	</el-select>
				</el-col>

                <el-col :span="3">
					<el-select size="mini" v-model="select.routeName" placeholder="请选择线路">
				   		<el-option v-for="routeName in routeList" :key="routeName" :label="routeName" :value="routeName"></el-option>
			    	</el-select>
				</el-col>
				
                <el-col :span="4">
					<el-date-picker size="mini" v-model="select.workdate" type="month" value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
				</el-col>

				<el-col :span="2">
					<el-button type="primary" size="mini" @click="_getEconomicMoththlyReport">查询</el-button>
				</el-col>

                <el-col :span="2">
					<el-button type="primary" size="mini" @click="exportData">下载</el-button>
				</el-col>
		 	</el-row>

		 	<el-table max-height="600" v-loading="loading" size="small" :data="dataTables" align="center" highlight-current-row style="width: 100%">
                <el-table-column fixed align="center" type="index" width="50"></el-table-column>
			    <el-table-column fixed align="center" prop="routeName" label="线路" width="60"></el-table-column>
                <el-table-column fixed align="center" prop="energyType" label="车型" width="60"></el-table-column>
                <el-table-column fixed align="center" label="基础指标">
                    <el-table-column fixed align="center" prop="selfNum" label="自编号" width="60"></el-table-column>    
                    <el-table-column fixed align="center" prop="tripMileage" label="趟公里" width="60"></el-table-column>
                </el-table-column>
                <el-table-column align="center" label="营运收入">
                    <el-table-column align="center" prop="cash" label="零票收入" width="60"></el-table-column>    
                    <el-table-column align="center" prop="icCardRevenue" label="IC卡收入" width="60"></el-table-column>
                    <el-table-column align="center" prop="icCardSubsidyRevenue" label="IC卡补贴收入" width="60"></el-table-column>
                    <el-table-column align="center" prop="virtualCardRevenue" label="虚拟卡收入" width="60"></el-table-column>
                    <el-table-column align="center" prop="virtualCardSubsidyRevenue" label="虚拟卡补贴" width="60"></el-table-column>
                    <el-table-column align="center" prop="alipay" label="支付宝收入" width="60"></el-table-column>    
                    <el-table-column align="center" prop="carRentalRevenue" label="租车收入" width="60"></el-table-column>
                    <el-table-column align="center" prop="actualRevenue" label="本月实际" width="60"></el-table-column>
                    <el-table-column align="center" prop="revenueHandlingFee" label="手续费" width="60"></el-table-column>
                    <el-table-column align="center" prop="planKmRevenue" label="计划公里收入（元/公里）" width="60"></el-table-column>
                    <el-table-column align="center" prop="planRevenue" label="本月计划" width="60"></el-table-column>
                    <el-table-column align="center" prop="revenueFinishRate" label="完成预算" width="60"></el-table-column>
                    <el-table-column align="center" prop="kmRevenue" label="公里收入" width="60"></el-table-column>
                    <el-table-column align="center" prop="tripRevenue" label="月趟收入" width="60"></el-table-column>
                    <el-table-column align="center" prop="avgVehicleRevenue" label="台车平均收入" width="60"></el-table-column>
                </el-table-column>
                <el-table-column align="center" label="载客人次">
                    <el-table-column align="center" prop="cashCount" label="现金消费人次" width="60"></el-table-column>
                    <el-table-column align="center" prop="icCount" label="电子钱包人次" width="60"></el-table-column>
                    <el-table-column align="center" prop="offsiteCount" label="异地卡" width="60"></el-table-column>
                    <el-table-column align="center" prop="adultsCount" label="成人钱包人次" width="60"></el-table-column>
                    <el-table-column align="center" prop="stuCount" label="学生卡人次" width="60"></el-table-column>
                    <el-table-column align="center" prop="employeeCount" label="员工卡人次" width="60"></el-table-column>
                    <el-table-column align="center" prop="employeeStuCount" label="员工学生卡人次" width="60"></el-table-column>
                    <el-table-column align="center" prop="seniorsCount" label="老年卡人次" width="60"></el-table-column>
                    <el-table-column align="center" prop="loveCardCount" label="爱心卡人次" width="60"></el-table-column>
                    <el-table-column align="center" prop="icTotalCount" label="IC卡消费人次小计" width="60"></el-table-column>
                    <el-table-column align="center" prop="virtualCardTotalCount" label="虚拟卡消费小计" width="60"></el-table-column>
                    <el-table-column align="center" prop="alipayCount" label="支付宝人次" width="60"></el-table-column>
                    <el-table-column align="center" prop="personflowTotal" label="载客人次合计" width="60"></el-table-column>
                </el-table-column>
                <el-table-column align="center" label="营运趟次">
                    <el-table-column align="center" prop="planTotalTrip" label="计划总趟次" width="60"></el-table-column>
                    <el-table-column align="center" prop="planOperationTrip" label="计划营运趟次" width="60"></el-table-column>
                    <el-table-column align="center" prop="actualOperationTrip" label="实际营运趟次" width="60"></el-table-column>
                    <el-table-column align="center" prop="tripFinishRate" label="趟次完成" width="60"></el-table-column>
                </el-table-column>
                <el-table-column align="center" label="营运公里">
                    
                    <el-table-column align="center" prop="planTotalMileage" label="计划总公里" width="60"></el-table-column>
                    <el-table-column align="center" prop="actualTotalMileage" label="实际总公里" width="60"></el-table-column>
                    <el-table-column align="center" prop="operationMileage" label="其中：营运公里" width="60"></el-table-column>
                    <el-table-column align="center" prop="noneOperationMileage" label="非营运公里" width="60"></el-table-column>
                    <el-table-column align="center" prop="rentalMileage" label="出租公里" width="60"></el-table-column>
                    <el-table-column align="center" prop="tramMileage" label="其中：电车公里" width="60"></el-table-column>
                    <el-table-column align="center" prop="fuelVehicleMileage" label="柴油公里" width="60"></el-table-column>
                    <el-table-column align="center" prop="mileageFinishRate" label="公里完成" width="60"></el-table-column>
                </el-table-column>
                <el-table-column align="center" label="燃料消耗">
                    <el-table-column align="center" label="电量(度)">
                        <el-table-column align="center" prop="actualChargePile" label="实际（度）" width="60"></el-table-column>
                        <el-table-column align="center" prop="totalChargePrice" label="费用（元）" width="60"></el-table-column>
                        <el-table-column align="center" prop="chargePer100Km" label="百公里度" width="60"></el-table-column>
                    </el-table-column>

                    <el-table-column align="center" label="柴油(升)">
                        <el-table-column align="center" prop="actualPuel" label="实际（升）" width="60"></el-table-column>
                        <el-table-column align="center" prop="totalPuelPrice" label="费用（元）" width="60"></el-table-column>
                        <el-table-column align="center" prop="puelPer100Km" label="百公里升" width="60"></el-table-column>
                    </el-table-column>
            
                </el-table-column>
		 	</el-table>
		</el-row>
	</div>
</template>
<script>
    import {getRouteGroup,getRouteNames} from '@/api/common'
    import {getEconomicMoththlyReport} from '@/api/statistics'
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
                loading:false,
				dataTables:[],
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
			_getEconomicMoththlyReport(){
                this.loading = true;
				getEconomicMoththlyReport(this.select).then(resp => {
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
				let url = baseURL + "/statistics/operating/download/economicMoththly?routeName=" + this.select.routeName + "&workdate=" + this.select.workdate;
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
			        let fileName = this.select.workdate + "_" + this.select.routeName + "_经济月报.xlsx";
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