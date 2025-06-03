import { useEffect, useState } from 'react';
import { apiCall } from './axiosFormat';
import { useNavigate } from 'react-router';
import { Storage } from '../stores/InAppStorage';

const PrivateRoute = ({children}:any) => {
  const [authenticated, setAuth] = useState(false)

    const navigate=useNavigate()
    useEffect(() => {
        const response =   apiCall({
            name: "refreshToken",
            action: (): any => (["skip"]),
            // errorAction: (): any => (navigate("/", {state: 'notAuthenticated'}),["skip"])
          })
          response.then( (res:any )=> {
            const newToken = res?.accessToken 
            if (newToken) {
              Storage.setItem('token', newToken); // Store the refreshed token
            }
            setAuth(true)
          }).catch((err:any)=>{
            console.error(err)
            navigate("/", {state: 'notAuthenticated'})
          })
      
    },[])

    if(authenticated) return children
}

export default PrivateRoute
