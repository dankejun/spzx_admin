import request from '@/utils/request';

const base_api = '/admin/system/sysRole';

export const GetSysRoleListByPage = (current, limit, sysRoleDto) => {
  return request({
    url: `${base_api}/findByPage/${current}/${limit}`,
    method: 'post',
    data: sysRoleDto
  });
};

export const SaveSysRole = (data) => {
  return request({
    url: `${base_api}/saveSysRole`,
    method: 'post',
    data
  });
};

// 保存修改
export const UpdateSysRole = (data) => {
  return request({
    url: '/admin/system/sysRole/updateSysRole',
    method: 'put',
    data
  });
};

// 删除角色
export const DeleteSysRoleById = (roleId) => {
  return request({
    url: '/admin/system/sysRole/deleteById/' + roleId,
    method: 'delete'
  });
};
