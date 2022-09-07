import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        meta: { isNeedAuth:false },
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        meta: { isNeedAuth:false },
        hidden: true
    },

    {
        path: '/',
        meta: { isNeedAuth:false },
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { title: 'Dashboard', icon: 'dashboard',isNeedAuth:true, affix: true }
        }]
    },
    {
        path: '/import',
        component: Layout,
        name: 'dataImport',
        meta: { title: '数据导入', icon: 'example',isNeedAuth:true },
        children: [
            {
                path: 'config',
                component: () => import('@/views/dataImport/config/index'), // Parent router-view
                name: 'data-import-config',
                meta: { title: '导入配置', icon:'table',isNeedAuth:true },
                children: [
                    {
                        path: 'dictionary',
                        component: () => import('@/views/dataImport/config/dictionary/index'),
                        name: 'data-import-dictionary',
                        meta: { title: '数据字典', icon:'table',isNeedAuth:true },
                        children: [
                            {
                                path: 'setting',
                                component: () => import('@/views/dataImport/config/dictionary/setting/dictionary_setting'),
                                name: 'dictionary-setting',
                                meta: { title: '字典配置',isNeedAuth:true }
                            },
                            {
                                path: 'data',
                                component: () => import('@/views/dataImport/config/dictionary/data/dictionary_data'),
                                name: 'dictionary-data',
                                meta: { title: '字典数据',isNeedAuth:true }
                            },
                            {
                                path: 'timeSegment',
                                component: () => import('@/views/dataImport/config/dictionary/timeSegment/index'),
                                name: 'dictionary-data',
                                meta: { title: '线路高平峰',isNeedAuth:true }
                            },        
                        ]
                    },
                    {
                        path: 'template',
                        component: () => import('@/views/dataImport/config/template/template'),
                        name: 'template',
                        meta: { title: '导入模板配置',isNeedAuth:true }
                    },
                    
                ]
            },
            {
                path: 'income',
                name: 'income',
                component: () => import('@/views/dataImport/income/index'),
                meta: { title: '营收导入', icon: 'table',isNeedAuth:true }
            },
            {
                path: 'mileage',
                name: 'mileage',
                component: () => import('@/views/dataImport/mileage/index'),
                meta: { title: '里程导入', icon: 'table',isNeedAuth:true }
            },
            {
                path: 'charge',
                name: 'charge',
                component: () => import('@/views/dataImport/charge/index'),
                meta: { title: '电耗导入', icon: 'table',isNeedAuth:true }
            },
            {
                path: 'fuel',
                name: 'fuel',
                component: () => import('@/views/dataImport/fuel/index'),
                meta: { title: '油耗导入', icon: 'table' ,isNeedAuth:true}
            },
            {
                path: 'trip',
                name: 'trip',
                component: () => import('@/views/dataImport/trip/index'),
                meta: { title: '趟次导入', icon: 'table' ,isNeedAuth:true}
            }
        ]
    },
    
    {
        path: '/statistics',
        component: Layout,
        name: 'statistics',
        meta: { title: '数据统计', icon: 'example',isNeedAuth:true },
        children: [
            {
                path: 'workplan',
                component: () => import('@/views/statistics/trip/index'), // Parent router-view
                name: 'statistics-workplan',
                meta: { title: '趟次统计', icon:'table' ,isNeedAuth:true},
                children: [
                    {
                        path: 'driver',
                        component: () => import('@/views/statistics/trip/driver'),
                        name: 'statistics-workplan-driver',
                        meta: { title: '司机趟次统计' ,isNeedAuth:true}
                    },
                    {
                        path: 'vehicle',
                        component: () => import('@/views/statistics/trip/vehicle'),
                        name: 'statistics-workplan-vehicle',
                        meta: { title: '车辆趟次统计' ,isNeedAuth:true}
                    },
                    {
                        path: 'statistics-workplan-merge',
                        component: () => import('@/views/statistics/trip/vehicleDriver'),
                        name: 'template',
                        meta: { title: '司机车辆趟次统计' ,isNeedAuth:true}
                    },
                    {
                        path: 'statistics-workplan-group',
                        component: () => import('@/views/statistics/trip/group'),
                        name: 'template',
                        meta: { title: '线路趟次统计' ,isNeedAuth:true}
                    },
                    {
                        path: 'statistics-mileage-group',
                        component: () => import('@/views/statistics/trip/mileage'),
                        name: 'mileage',
                        meta: { title: '车辆里程统计' ,isNeedAuth:true}
                    },
                ]
            },
            {
                path: 'revenue',
                component: () => import('@/views/statistics/revenue/index'), // Parent router-view
                name: 'statistics-revenue',
                meta: { title: '营收与客流量统计', icon:'table' ,isNeedAuth:true},
                children: [
                    {
                        path: 'icCard',
                        component: () => import('@/views/statistics/revenue/icCard'),
                        name: 'statistics-revenue-icCard',
                        meta: { title: 'IC卡统计' ,isNeedAuth:true}
                    },
                    {
                        path: 'xxykt',
                        component: () => import('@/views/statistics/revenue/xxykt'),
                        name: 'statistics-revenue-xxykt',
                        meta: { title: '湘行一卡通统计' ,isNeedAuth:true}
                    },
                    {
                        path: 'alipay',
                        component: () => import('@/views/statistics/revenue/alipay'),
                        name: 'statistics-revenue-alipay',
                        meta: { title: '支付宝统计' ,isNeedAuth:true}
                    },
                    {
                        path: 'nonCash',
                        component: () => import('@/views/statistics/revenue/nonCash'),
                        name: 'statistics-revenue-nonCash',
                        meta: { title: '非现金营收合并统计' ,isNeedAuth:true}
                    },
                    {
                        path: 'cash',
                        component: () => import('@/views/statistics/revenue/cash'),
                        name: 'statistics-revenue-cach',
                        meta: { title: '现金统计' ,isNeedAuth:true}
                    },
                    {
                        path: 'icCardReport',
                        component: () => import('@/views/statistics/revenue/icCardReport'),
                        name: 'statistics-revenue-icCardReport',
                        meta: { title: '驾驶员IC卡上报统计' ,isNeedAuth:true}
                    }
                ]
            },
            {
                path: 'speeding',
                component: () => import('@/views/statistics/speeding/index'), // Parent router-view
                name: 'statistics-operating-report',
                meta: { title: '超速', icon:'table' ,isNeedAuth:true},
                children:[
                    {
                        path: 'detailQuery',
                        component: () => import('@/views/statistics/speeding/detailQuery'),
                        name: 'statistics-revenue-daily',
                        meta: { title: '线路超速查询' ,isNeedAuth:true}
                    }
                ]
            },
            {
                path: 'adas',
                component: () => import('@/views/statistics/adas/index'), // Parent router-view
                name: 'statistics-adas-report',
                meta: { title: '主动安全查询', icon:'table' ,isNeedAuth:true},
                children:[
                    {
                        path: 'adasQuery',
                        component: () => import('@/views/statistics/adas/adasQuery'),
                        name: 'statistics-adasQuery-daily',
                        meta: { title: '主动安全查询' ,isNeedAuth:true}
                    }
                ]
            },

            {
                path: 'operating',
                component: () => import('@/views/statistics/operating/index'), // Parent router-view
                name: 'statistics-operating-report',
                meta: { title: '经营报表', icon:'table' ,isNeedAuth:true},
                children: [
                    {
                        path: 'daily',
                        component: () => import('@/views/statistics/operating/daily'),
                        name: 'statistics-revenue-daily',
                        meta: { title: '日报表' ,isNeedAuth:true}
                    },
                    {
                        path: 'operation',
                        component: () => import('@/views/statistics/operating/operation'),
                        name: 'statistics-revenue-operation',
                        meta: { title: '营运日报' ,isNeedAuth:true}
                    },
                    {
                        path: 'economicMoththly',
                        component: () => import('@/views/statistics/operating/economicMoththly'),
                        name: 'statistics-revenue-economicMoththly',
                        meta: { title: '经济指标月报' ,isNeedAuth:true}
                    },
                    {
                        path: 'totalRouteDaily',
                        component: () => import('@/views/statistics/operating/totalRouteDaily'),
                        name: 'statistics-revenue-totalRouteDaily',
                        meta: { title: '出车与趟次里程汇总统计' ,isNeedAuth:true}
                    }
                ]
            },
            {
                path: 'mileage',
                component: () => import('@/views/statistics/mileage/index'), // Parent router-view
                name: 'statistics-mileage',
                meta: { title: '里程统计', icon:'table' ,isNeedAuth:true},
                children: [
                    {
                        path: 'report',
                        component: () => import('@/views/statistics/mileage/mileageReport'),
                        name: 'statistics-mileage-report',
                        meta: { title: '驾驶员里程上报' ,isNeedAuth:true}
                    },
                ]
            },
        ]
    },
    {
        path: '/analysis',
        component: Layout,
        name: 'analysis',
        meta: { title: '数据分析', icon: 'example',isNeedAuth:true },
        children: [
            {
                path: 'vehicle',
                component: () => import('@/views/analysis/vehicle/index'), // Parent router-view
                name: 'analysis-vehicle',
                meta: { title: '车辆', icon:'table' },
                children: [
                    {
                        path: 'mileage',
                        component: () => import('@/views/analysis/vehicle/mileageAnalysis'),
                        name: 'mileageAnalysis',
                        meta: { title: '里程分析' ,isNeedAuth:true}
                    },
                    {
                        path: 'fuel',
                        component: () => import('@/views/analysis/vehicle/fuelAnalysis'),
                        name: 'fuelAnalysis',
                        meta: { title: '油/电耗' ,isNeedAuth:true}
                    },
                ]
            },
            {
                path: 'driver',
                component: () => import('@/views/analysis/vehicle/index'), // Parent router-view
                name: 'analysis-driver',
                meta: { title: '驾驶员', icon:'table' ,isNeedAuth:true},
                children: [
                    {
                        path: 'mileage',
                        component: () => import('@/views/analysis/driver/mileageAnalysis'),
                        name: 'mileageAnalysis',
                        meta: { title: '里程分析' ,isNeedAuth:true}
                    },
                    {
                        path: 'fuel',
                        component: () => import('@/views/analysis/driver/fuelAnalysis'),
                        name: 'mileageAnalysis',
                        meta: { title: '油/电耗' ,isNeedAuth:true}
                    },
                    {
                        path: 'income',
                        component: () => import('@/views/analysis/driver/incomeAnalysis'),
                        name: 'mileageAnalysis',
                        meta: { title: '收入' ,isNeedAuth:true}
                    },
                ]
            },
            {
                path: 'route',
                component: () => import('@/views/analysis/route/index'), // Parent router-view
                name: 'analysis-route',
                meta: { title: '线路', icon:'table' ,isNeedAuth:true},
                children: [
                    {
                        path: 'income',
                        component: () => import('@/views/analysis/route/incomeAnalysis'),
                        name: 'mileageAnalysis',
                        meta: { title: '营收' ,isNeedAuth:true}
                    },
                    {
                        path: 'safety',
                        component: () => import('@/views/analysis/route/safetyAnalysis'),
                        name: 'mileageAnalysis',
                        meta: { title: '安全' ,isNeedAuth:true}
                    },
                    {
                        path: 'dailytable',
                        component: () => import('@/views/analysis/route/routeDailytable'),
                        name: 'mileageAnalysis',
                        meta: { title: '日报表' ,isNeedAuth:true}
                    },
                ]
            },
            {
                path: 'company',
                component: () => import('@/views/analysis/vehicle/index'), // Parent router-view
                name: 'analysis-vehicle',
                meta: { title: '公司', icon:'table' ,isNeedAuth:true},
                children: [
                    {
                        path: 'operation',
                        component: () => import('@/views/analysis/company/operationAnalysis'),
                        name: 'mileageAnalysis',
                        meta: { title: '营运' ,isNeedAuth:true}
                    },
                    {
                        path: 'income',
                        component: () => import('@/views/analysis/company/incomeAnalysis'),
                        name: 'mileageAnalysis',
                        meta: { title: '营收' ,isNeedAuth:true}
                    },
                ]
            }
        ]
    },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
