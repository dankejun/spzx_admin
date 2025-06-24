import request from '@/utils/request';

// 获取验证码
export function getValidateCode() {
  return request({
    url: '/admin/system/index/generateValidateCode',
    method: 'get'
  });
}

export function login(data) {
  return request({
    url: '/admin/system/index/login',
    method: 'post',
    data
  });
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  });
}

export function logout(token) {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post',
    params: { token }
  });
}
