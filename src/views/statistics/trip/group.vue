<template>
	<div class="schedule-wrap">
		<el-row class="schedule-panel">
			<el-row :gutter="20">
				<el-col :span="5">
					<el-date-picker size="mini" v-model="select.workdate" type="month" value-format="yyyy-MM"  @change="dateChange"  placeholder="选择月份"></el-date-picker>
				</el-col>

				<el-col :span="3">
					<el-select size="mini" v-model="select.groupName" @change="groupNameChange" placeholder="请选择大队">
				   		<el-option v-for="groupName in routeGroups" :key="groupName" :label="groupName" :value="groupName"></el-option>
			    	</el-select>
				</el-col>

				<el-col :span="2">
					<el-button type="primary" size="mini" @click="getWorkplanTrip">查询</el-button>
				</el-col>

				<el-col :span="2">
					<el-button type="primary" size="mini" @click="exportData">下载</el-button>
				</el-col>
		 	</el-row>

		 	<div class="tableBox" v-for="route in routeTables" :key="route.routeName">
				<h4 v-text="route.title"></h4>
				<el-table max-height="500" size="small" :data="route.workplanTrips" align="center" highlight-current-row style="width: 100%">
					<el-table-column v-for="dayObj in days" :prop="dayObj.dayStr" :label="dayObj.day" :key="dayObj.id" :width="dayObj.width"></el-table-column>
				</el-table>
			</div>
		</el-row>
	</div>
</template>
<script>
	import axios from 'axios'
	import { getToken } from '@/utils/auth'
    import {getRouteGroup,getRouteNames} from '@/api/common'
    import {groupWorkplan} from '@/api/statistics'
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
    import {getTableHeader} from '@/utils/dateTableHeader'
	export default{
		name:"statistics-workplan-group",
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
				routeTables:[],
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
			getWorkplanTrip(){
				groupWorkplan(this.select).then(resp => {
					if(resp.code == REQ_SUCCESS){
						for(let i = 0; i < resp.result.length; i++){
							resp.result[i].workplanTrips = this.handlerResult(resp.result[i].workplanTrips);
							resp.result[i].title = this.getTilePrefix(resp.result[i].groupName) + '_线路趟次统计表';
						}
						this.routeTables = resp.result;
					}
				});
			},
			handlerResult(result){
				let dayArr = this.days;
				result.forEach(ele => {
					for(let i = 0; i < dayArr.length; i++){
						if(undefined == ele[dayArr[i].dayStr] || null == ele[dayArr[i].dayStr]){
							ele[dayArr[i].dayStr] = 0;
						}
					}
				});
				return result;
			},
			dateChange(val){
				this.createDay();
			},
			groupNameChange(val){
                this.select.groupName = val;
                this._getRouteNames(val);
			},
			createDay(){
				let dayArr = getTableHeader(this.select.workdate,55);
				dayArr.unshift({
					id:-1,
					dayStr:"routeName",
					width:80,
					day:"线路"
				});
				dayArr.push({
					id:-2,
					dayStr:"tripCount",
					width:80,
					day:"合计"
				});	
				this.days = dayArr;
				this.dataTables = [];
			},
			exportData(){
				let url = baseURL + "/statistics/workplan/down/group?groupName=" 
								  + this.select.groupName + "&workdate=" 
								  + this.select.workdate;
                let fileName = this.getFileNamePrefix() + "_线路趟次统计表.xlsx";
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
			        link.setAttribute('download', fileName);
			        document.body.appendChild(link);
			        link.click();
				})
			},
			getFileNamePrefix(){
				let fileName = this.select.workdate;
				if(this.select.groupName){
					fileName = "_" + this.select.groupName;
				}
				if(this.select.routeName){
					fileName = "_" + this.select.routeName;
				}
				return fileName;
			},
			getTilePrefix(routeName){
				return this.select.workdate + "_" + routeName;
			}
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
	.tableBox {
		margin-top: 20px;
	}
	.tableBox h4{
		text-align: center;
	}
</style>