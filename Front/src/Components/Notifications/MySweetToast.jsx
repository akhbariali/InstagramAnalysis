import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MySweetToast = () =>{
    // useEffect(()=>{
    //     // toast("here")
    // }, [])

    return (
        <div>
            <ToastContainer
                position="top-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition: Bounce
            />

        </div>
    )
}
export default MySweetToast