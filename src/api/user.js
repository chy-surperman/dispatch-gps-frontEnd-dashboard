import {request} from '@/utils/request'

export function login(data) {
  const url = '/data/login';
  return request.post(url,data);
}

export function logout() {
  const url = '/data/logout';
  return request.get(url);
}
