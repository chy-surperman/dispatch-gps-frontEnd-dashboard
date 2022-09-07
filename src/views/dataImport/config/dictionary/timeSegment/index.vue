<template>
	<div class="dashboard-container">
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

            <el-col :span="2">
                <el-button type="primary" size="mini" @click="getWorkplanTrip">查询</el-button>
            </el-col>
        </el-row>
		<el-table v-loading="loading" border ref="planruleTable" :data="tableData" size="mini" :max-height="height" :height="height" align="center" style="width: 100%">
			<el-table-column prop="startTimeStr" label="开始时间" align="center" width="120">
				<template slot-scope="scope">
					<span v-if="!scope.row.isEdit" v-text="scope.row.startTimeStr"></span>
					<timeInputComponent v-if="scope.row.isEdit" width="40" :time="scope.row.startTimeStr" v-model="scope.row.startTimeStr"></timeInputComponent>
				</template>
			</el-table-column>
			
			<el-table-column prop="endTimeStr" label="结束时间" align="center" width="120">
				<template slot-scope="scope">
					<span v-if="!scope.row.isEdit" v-text="scope.row.endTimeStr"></span>
					<timeInputComponent v-if="scope.row.isEdit" width="40" :time="scope.row.endTimeStr" v-model="scope.row.endTimeStr"></timeInputComponent>
				</template>
			</el-table-column>

			<el-table-column prop="typeStr" label="高低峰" align="center" width="100">
	            <template slot-scope="scope">
		    		<span v-if="!scope.row.isEdit" v-text="scope.row.typeStr"></span>
                    <el-select v-if="scope.row.isEdit" placeholder="请选择" v-model="scope.row.type" size="mini">
                        <el-option label="高峰" value="1"></el-option>
	      				<el-option label="低峰" value="2"></el-option>
                    </el-select>
              	</template>
	        </el-table-column>

			<el-table-column prop="interval" label="间隔" align="center" width="150">
				<template slot-scope="scope">
					<span v-if="!scope.row.isEdit" v-text="scope.row.interval"></span>
					<el-input-number style="width:120px;" v-if="scope.row.isEdit" size="mini" v-model="scope.row.interval"></el-input-number>
				</template>
			</el-table-column>

			<el-table-column align="center" header-align="center" label="操作">
				<template slot-scope="scope">
					<el-button type="success" v-if="scope.row.isEdit" size="mini" @click="savePlanrule(scope.row)">保存</el-button>
					<el-button type="info" v-if="scope.row.isEdit" size="mini"  @click="deleteData(scope.$index)">取消</el-button>
					<el-button v-show="!scope.row.isEdit" type="primary" size="mini" icon="el-icon-edit" 
									@click="editPlanrule(scope.row)"></el-button>
					<el-button v-show="!scope.row.isEdit" type="danger" size="mini" icon="el-icon-delete" 
									@click="deleteInterval(scope.row)"></el-button>					
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
import { baseURL,REQ_SUCCESS } from '@/utils/APIConstans'
import {getRouteGroup,getRouteNames} from '@/api/common'
import timeInputComponent from '@/components/TimeInput/index.vue'
import {getWorkplanIntervals,saveWorkplanInterval,deleteWorkplanInterval} from '@/api/dictionary'
export default {
  	name: 'departureIntervalTab',
	props:["routeName","starttag"],
	components:{
		timeInputComponent
	},
  	data() {
	    return {
	        tableData: [],
			height:395,
			loading:false
	    }
  	},
  	methods: {
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
        groupNameChange(val){
            this.select.groupName = val;
            this._getRouteNames(val);
        },
	    _getWorkplanIntervals(){
	        let param = {
	            routeName:this.routeName,
	            starttag:this.starttag
			}
			this.loading = true;
	        getWorkplanIntervals(param).then(resp => {
				this.loading = false;
	            if(resp.code == REQ_SUCCESS){
	                resp.result.forEach(ele => {
						if(ele.type == 2){
							ele.typeStr = '平峰';
						}else if(ele.type == 1){
							ele.typeStr = "高峰";
						}

	                	ele.model = "edit";
	                	ele.isEdit = false;
					});
					this.tableData = resp.result;
	            }
	        })
	    },
	    addWorkplanInterval(){
			let rule = {
	    		endTime:'',
				endTimeStr:'',
				interval:'',
				startTime: '',
				startTimeStr: '',
				startHour: '',
				startMinute: '',
				starttag:this.starttag,
				type:'',
				typeStr:'',
				isEdit:true,
				model:"add"
	    	};
			if(this.tableData.length > 0){
				let ele = this.tableData[this.tableData.length - 1];
				let endTArray = ele.endTimeStr.split(":");
				
				rule.startTime = ele.endTime;
				rule.startTimeStr = ele.endTimeStr;
				rule.startHour = endTArray[0];
				rule.startMinute = endTArray[1];
			}
		
	    	this.tableData.push(rule);
	    },
	    savePlanrule(row){
	    	if(row.model == "add"){
	    		this.createPlanrule(row);
	    	}else{
	    		this.modifyPlanrule(row);
	    	}
	    },
	    editPlanrule(row){
	    	console.log(row);
	    	row.model = "edit";
			row.isEdit = true;
	    },
	    deleteData(index){
			if(this.tableData[index].model == "add"){
				this.tableData.splice(index,1);
			}
			else{
				this._getWorkplanIntervals();
			}
		},
	    createPlanrule(row){
	    	let params = {
	    		routeName:this.routeName,
				starttag:this.starttag,
				type:row.type,
	    		startTimeStr:row.startTimeStr + ":00",
	    		endTimeStr:row.endTimeStr + ":00",
	    		interval:row.interval
	    	};
	    	saveWorkplanInterval(params).then(resp => {
	    		if(resp.code == REQ_SUCCESS){
	    			this._getWorkplanIntervals();
	    		}
	    	})
	    },
	    modifyPlanrule(row){
	    	let params = {
	    		id:row.id,
	    		routeName: this.routeName,
				starttag: row.starttag,
				type:row.type,
	    		startTimeStr:row.startTimeStr,
	    		endTimeStr:row.endTimeStr,
	    		interval:row.interval
	    	};
	    	saveWorkplanInterval(params).then(resp => {
	    		if(resp.code == REQ_SUCCESS){
	    			this._getWorkplanIntervals();
	    		}else{
	    			this.$message.error(resp.define);
	    		}
	    	})
	    },
	    deleteInterval(row){
	    	
			this.$confirm('是否删除该发车间隔?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
					let param = {
						id:row.id
					}
					deleteWorkplanInterval(param).then(resp => {
						if(resp.code == REQ_SUCCESS){
							this._getWorkplanIntervals();
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						}else{
							this.$message({
								type: 'error',
								message: '删除失败'
							});     
						}
					})
			}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
			});
	    }
 	},
  	created(){
  		this.routeName = this.$route.query.routeName;
    	this._getWorkplanIntervals();
  	},
  	watch:{
	    '$route'(){
	      	this.routeName = this.$route.query.routeName;
	    },
	    routeName(newVal){
	     	this.routeName = newVal;
	      	this._getWorkplanIntervals();
	    } 
  	}
}
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
.import-data-table {
    margin-bottom: 100px;
}
.confim-box {
    position: fixed;
    z-index: 3;
    bottom: 0;
    background-color: #fff;
    width: 90%;
    height: 100px;
}
</style>