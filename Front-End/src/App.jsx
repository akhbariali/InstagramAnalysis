import {useEffect, useState} from "react";
import Loading from "./Components/Loading/Loading.jsx";
import RouterContainer from "./Router.jsx";

const App = () => {
    const [hasToken, setHasToken] =  useState((localStorage.getItem("token"))? true: false)
   
    useEffect(()=>{
        if(localStorage.getItem("token"))
            setHasToken(true)
    },[])

    return (

        <>
        {/* {(unitUsLoading || can_lsLoading) ? <Loading /> : ""} */}
        <RouterContainer setHasToken={setHasToken} hasToken={hasToken} />
    </>

    )
}
export default App
