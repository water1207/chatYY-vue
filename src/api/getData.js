import base from './index'
let axios = base.axios
let baseUrl = base.baseUrl

// 获取好友
export const fetchMyFriends = (uId) => {
    return axios({
      method: 'get',
      baseURL: `${baseUrl}/fetchMyFriends`,
      params: {
        u_id : parseInt(uId)
      }
    }).then(res => res.data)
  }

// 获取好友
export const fetchMyGroups = (uId) => {
  return axios({
    method: 'get',
    baseURL: `${baseUrl}/fetchMyGroups`,
    params: {
      u_id : parseInt(uId)
    }
  }).then(res => res.data)
}

// 获取历史聊天记录
export const loadPersonalMessage = (_from, _to) => {
  return axios({
    method: 'get',
    baseURL: `${baseUrl}/getHistoryMessage`,
    params: {
      from : parseInt(_from),
      to: parseInt(_to)
    }
  }).then(res => res.data)
}

// 获取历史聊天记录
export const getGroupMessage = gId => {
  return axios({
    method: 'get',
    baseURL: `${baseUrl}/getHistoryGroupMessage2`,
    params: {
      g_id: parseInt(gId)
    }
  }).then(res => res.data)
}

  // 获取聊天信息
export const getChatMsg = params => {
  return axios({
    method: 'post',
    baseURL: `${baseUrl}/friend/chatMsg`,
    data: params
  }).then(res => res.data)
}

export const getUserInfo = (uId) => {
  return axios({
    method: 'get',
    baseURL: `${baseUrl}/userInfo`,
    params: {
      u_id : uId
    }
  }).then(res => res.data)
}
