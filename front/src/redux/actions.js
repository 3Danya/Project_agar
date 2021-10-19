const actionPending = name => ({type: 'PROMISE', status: 'PENDING', name})
const actionResolved = (name, payload) => ({type: 'PROMISE', status: 'RESOLVED', name, payload})
const actionRejected = (name, error) => ({type: 'PROMISE', status: 'REJECTED', name, error})

const actionPromise = (name, promise) => 
    async dispatch => {
        dispatch(actionPending(name))
        try{
            let payload = await promise
            dispatch(actionResolved(name, payload)) 
            return payload
        }
        catch(error){
             dispatch(actionRejected(name, error))
        }
    }
const getGQL = url => 
    (query, variables={}) => {
      let headers;
      if(localStorage.token){
        headers = {
          "Content-Type": "application/json",
          "Authorization":"Bearer " + localStorage.token
        }
      }else{
        headers = {
          "Content-Type": "application/json",
        }
      }
      return fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({query, variables})
    }).then(res => res.json())}

let shopGQL = getGQL('http://109.86.248.165:12123/graphql')

const actionPosts = () =>
    actionPromise('posts', shopGQL(
      `query getPosts{
        getPosts{
          id,title,user {
            id,username
          }
        }
      }
        `))

const actionGetToken = (username, password) => 
        actionPromise('getToken', shopGQL(`query log($username:String!,$password:String!){
                                                login(username:$username, password:$password)
                                            }`,{"username":username,"password":password}))
    
const actionAuthLogin = token => ({type: 'LOGIN', token})
    
const actionFullLogin = (login, password) =>
        async dispatch => {
            let payload = await dispatch(actionGetToken(login,password))
            if (payload?.data?.login){
                dispatch(actionAuthLogin(payload.data.login))
            }
        }
const actionRegister = (login,password,birthday) =>
        actionPromise('register',shopGQL(`mutation reg($username:String!,$password:String!,$birthday:String){
          register(username:$username,password:$password,birthday:$birthday){
            id,username
          }
        }`,{"username":login,"password":password,"birthday":birthday}))
    
const actionFullRegister = (login,password,birthday) =>
      async dispatch => {
        let payload = await dispatch(actionRegister(login,password,birthday))
        if(payload?.data?.register != null){
          await dispatch(actionFullLogin(login,password))
        }
      }

const actionLogout = () => ({type:"LOGOUT"})

const actionStats = (lim) =>
    actionPromise('stats', shopGQL(
      `query get($limit:Float!){
        getGames(limit:$limit){
          name,size,duration,id,img,time
        }
      }
        `,{"limit":lim}))

const actionImg = (img) =>
    actionPromise('avatar', shopGQL(
      `mutation img($img:String!){
        addImage(img:$img){
          id,username,img
        }
    }`,{"img":img}))

const actionChangePassword = (password,newPassword) =>
    actionPromise('newPassword', shopGQL(
      `mutation newPassword($password:String!,$newPassword:String!){
        newPassword(password:$password,newPassword:$newPassword){
          id,username,img
        }
    }`,{"password":password,"newPassword":newPassword}))

const actionUploadImg = (file) =>
      async(dispatch) =>{
        let res = await fetch('http://109.86.248.165:12123/upload', {
        method: "POST",
        body: file,
        headers:{"token":localStorage.token}
      })
      await dispatch(actionPromise('img',res.json()))
    }


export {actionPosts,actionFullLogin,actionFullRegister,actionLogout,actionStats,actionUploadImg,actionImg,actionChangePassword}