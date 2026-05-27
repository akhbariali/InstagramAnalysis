import axios from "axios"
import { MyToast } from "../Components/globalServices.js";
const localRequest = axios.create({
    baseURL: "https://data-gathering.liara.run/"
})

localRequest.interceptors.request.use(
    config=>{
      config.headers.Authorization = localStorage.getItem("token")
      return config
    },
    error => {
      return Promise.reject(error)
    }

)
localRequest.interceptors.response.use(
    res => {
        if(res.status >= 200 && res.status < 300 ) { //for auto refresh in update
            // toast('ارتباط موفق', {
            //     position: "top-right",
            //     autoClose: 1000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "light",
            //     transition: Bounce,
            // });
            // return res;

            if(res.data.Result){
                if(res.data.Result === 1){
                    return res;
                }else{
                    MyToast("error",2000,res.data.Message)
                }
            }
            else{
                return res;
            }
            
        }
    },
    error =>{
            MyToast("error",1000,"ارتباط ناموفق")
            if(error.response?.status === 401){
                MyToast("error",2000,"نیاز به ورود مجدد")
                // window.location.replace("/login");
            }
            return Promise.reject(error)
        // }
    }
)

export {localRequest}