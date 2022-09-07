<template>
	<div class="schedule-wrap">
		<el-row class="schedule-panel">
			<el-row :gutter="20" style="margin-bottom:15px;">
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
				
                <el-col :span="5">
					<el-date-picker size="mini" v-model="select.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
				</el-col>

				<el-col :span="5">
					<el-date-picker size="mini" v-model="select.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
				</el-col>

				<el-col :span="2">
					<el-button type="primary" size="mini" @click="query">查询</el-button>
				</el-col>

				<el-col :span="2">
					<el-button type="primary" size="mini" @click="exportData">下载</el-button>
				</el-col>

		 	</el-row>

		 	<el-table max-height="500" v-loading="loading" size="small" :data="dataTables" align="center" highlight-current-row style="width: 100%">
                <el-table-column align="center" type="index" width="50"></el-table-column>
			    <el-table-column align="center" prop="date" label="日期" width="100"></el-table-column>
                <el-table-column align="center" prop="selfNum" label="车号" width="80"></el-table-column>
                <el-table-column align="center" prop="routeName" label="线路" width="100"></el-table-column>
                <el-table-column align="center" prop="driverName" label="驾驶员" width="100"></el-table-column>
                <el-table-column align="center" prop="startTime" label="超速时间" width="200"></el-table-column>
				<el-table-column align="center" prop="endTime" label="结束时间" width="200"></el-table-column>
				<el-table-column align="center" prop="timeLong" label="超速时长(单位:秒)" width="130"></el-table-column>
				<el-table-column align="center" prop="startSpeed" label="开始速度" width="100"></el-table-column>
				<el-table-column align="center" prop="endSpeed" label="结束速度" width="100"></el-table-column>
		 	</el-table>

			<el-row :gutter="20" style="margin:20px;">
				<el-col :span="16" :offset="8">
					<el-pagination
						background
						:page-sizes="[10, 20, 30, 40]"
						:page-size="pagination.pageSize"
						:current-page="pagination.currentPage"
						layout="total, sizes, prev, pager, next, jumper"
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:total="pagination.total">
					</el-pagination>
				</el-col>
			</el-row>
		</el-row>
	</div>
</template>
<script>
    import {getRouteGroup,getRouteNames} from '@/api/common'
	import {querySpeedingDetail} from '@/api/statistics'
	import axios from 'axios'
	import { getToken } from '@/utils/auth'
    import {REQ_SUCCESS,baseURL} from '@/utils/APIConstans'
	export default{
		name:"statistics-workplan-driver",
		data(){
			return {
				routeList:[],
                routeGroups:[],
                select:{
                    groupName:'',
					startDate:'',
					endDate:'',
                    routeName:''
				},
				pagination:{
					total:0,
					pageSize:10,
					currentPage:1
				},
				dataTables:[],
				loading:false,
				days:[]
			}
		},
		methods:{
			_getRouteNames(groupName){
				this.loading = true;
				getRouteNames({groupName}).then(resp => {
					this.loading = false;
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
			
			groupNameChange(val){
                this.select.groupName = val;
                this._getRouteNames(val);
			},
			handleCurrentChange(val){
				this.pagination.currentPage = val;
				this.query();
			},
			handleSizeChange(val){
				this.pagination.pageSize = val;
				this.query();
			},
			exportData(){
				let url = baseURL + "/statistics/speeding/downDetail?routeName=" 
								  + this.select.routeName + "&startDate=" 
								  + this.select.startDate + "&groupName=" 
								  + this.select.groupName + "&endDate="
								  + this.select.endDate;

                let fileName = this.getFileNamePrefix() + "_驾驶员趟次统计表.xlsx";
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
				let fileName = this.select.startDate + "-" + this.select.endDate;
				if(this.select.groupName){
					fileName =fileName + "_" + this.select.groupName;
				}
				if(this.select.routeName){
					fileName =fileName + "_" + this.select.routeName;
				}
				return fileName;
			},
			query(){
				let params = {
					...this.select,
					pageSize:this.pagination.pageSize,
					currentPage:this.pagination.currentPage
				}
				querySpeedingDetail(params).then(resp => {
					const {code,result} = resp;
					if(code == REQ_SUCCESS){
						this.dataTables = result.dataList;
						if(this.dataTables.length == 0){
							this.$message.info("无超速数据");
						}
						this.pagination.total = result.totalCount;
					}
				})
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
</style>