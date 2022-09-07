import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const menuKey = 'user_access_menu'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getMenu(){
  return JSON.parse(sessionStorage.getItem(menuKey));
}

export function setMenu(menu){
  return sessionStorage.setItem(menuKey,JSON.stringify(menu));
}

export function removeMenu(){
  sessionStorage.removeItem(menuKey);
}

export function getAuthRoutes(menus,routes){
  filterAuthRoutes(menus,routes);
}

function filterAuthRoutes(menus,routes){
  for(let i = 0; i < routes.length; i++){
    let route = routes[i];
    
    if(route.hasOwnProperty('meta') && route.meta.hasOwnProperty('isNeedAuth') && !route.meta.isNeedAuth){
      continue;
    }
    if(route.hasOwnProperty('meta')){
      if(route.meta.hasOwnProperty('title')){
        route.hidden = !isMenuAuthByName(menus,route.meta.title);
      }else{
        route.hidden = false;
      }
    }else{
      route.hidden = false;  
    }
    
    if(route.children){
      filterAuthRoutes(menus,route.children);
    }
  }
}

function isMenuAuthByName(menus,menuName) {
	if(hasMenuByName(menus,menuName))
		return true;
	return false;
}

function hasMenuByName(menus,menuName){
	let data;
	for(let i = 0; i < menus.length; i++){
		if(menus[i].menuName == menuName){
			data = menus[i];
			return data;
		}else if(menus[i].childMenus != null &&  menus[i].childMenus.length > 0){
			data = hasMenuByName(menus[i].childMenus,menuName);
			if(data){
				return data;
			}
		}
	}
	return data;
}
