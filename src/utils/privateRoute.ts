import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { apiCall } from './axiosFormat';

const PrivateRoute = ({children}:any) => {
  const [authenticated, setAuth] = useState(false)

    // const navigate=useNavigate()
    useEffect(() => {
        const response =   apiCall({
            name: "getCurrentLogin",
            action: (): any => (["skip"]),
            // errorAction: (): any => (navigate("/", {state: 'notAuthenticated'}),["skip"])
          })
      
          response.then( (res:any )=> {
            setAuth(true)
          }).catch((err:any)=>{
            console.error(err)
          })
      
    })

    if(authenticated) return children
}

export default PrivateRoute
