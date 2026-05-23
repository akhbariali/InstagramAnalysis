import React, { useEffect, useState } from 'react';
import { IoEye, IoEyeOff } from "react-icons/io5";
import loginImg from "../assets/images/login.png";
import LoginContainer from '../Components/Container/LoginContainer.jsx';
import { localRequest } from '../configs/axiosService.js';
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { MyToast } from '../Components/globalServices.js';
import { Spinner } from 'flowbite-react';
import AnimatedHeader from '../Components/Container/AnimatedHeader.jsx';
import TypingTitle from '../Components/Title/typingTitle.jsx';

const Login = ({ setHasToken }) => {

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async () => {
        setLoading(true)
        const user = document.getElementById("email").value
        const pass = document.getElementById("password").value

        localRequest.post("api/auth/login/", {
            username: user,
            password: pass
        }).then((res) => {
            localStorage.setItem("token", "Bearer " + res.data.access)
            setHasToken(true)
            navigate("/main");
        }).catch((e) => {
            setLoading(false)
            if (e.status == 401) {
                MyToast("error", 2000, "حساب کاربری یافت نشد")
            }
        })

    }

    return (
        <AnimatedHeader>
            <div className='grid grid-cols-2 gap-5 overflow-auto' dir='rtl'>

                <div className='m-auto'>
                    <TypingTitle titles={["سامانه تحلیل داده های شبکه اجتماعی", "بیش از 10000 داده اینستاگرام"]} />
                </div>
                <LoginContainer element={
                    <>
                        <section
                            className="relative w-full backdrop-brightness-150 bg-white/30 h-[45vh] bg-cover bg-blend-lighten bg-center flex flex-col items-center justify-start"
                            style={{ backgroundImage: `url(${loginImg})` }}
                        >
                        </section>
                        <section
                            className="relative w-full h-[45vh] bg-cover bg-center flex flex-col items-center justify-start"
                        >

                            {/* Login Form */}
                            <div
                                className="w-full bg-transparent"
                                dir="ltr"
                            >
                                <div className="space-y-5">
                                    {/* Email Input */}
                                    <div className="relative mx-5 mt-3">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className=" bg-DarkBlue placeholder-LightGreen text-xl text-center border-b-LightGreen border-b-2 outline-none border-transparent text-LightGreen block w-full p-3"
                                            placeholder="ایمیل"
                                            required=""
                                        />
                                        <div className="absolute inset-y-0 left-3 flex items-center">
                                            <MdEmail className="text-LightGreen text-2xl" />
                                        </div>
                                    </div>

                                    {/* Password Input */}
                                    <div className="relative mx-5">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            className="bg-transparent placeholder-LightGreen text-xl border-b-LightGreen border-b-2 text-center border-transparent outline-none text-LightGreen w-full p-3"
                                            placeholder="کلمه عبور"
                                            required=""
                                        />
                                        <div className="absolute inset-y-0 left-3 flex items-center">
                                            <FaKey className="text-LightGreen text-2xl" />
                                        </div>
                                        <div className="absolute inset-y-0 right-3 flex items-center">
                                            {showPassword ? (
                                                <IoEyeOff
                                                    className="text-LightGreen text-2xl cursor-pointer"
                                                    onClick={() => setShowPassword(false)}
                                                />
                                            ) : (
                                                <IoEye
                                                    className="text-LightGreen text-2xl cursor-pointer"
                                                    onClick={() => setShowPassword(true)}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Forgot Password */}
                                    {/* <div className="text-center pt-4">
                                        <a
                                            href="#"
                                            className="text-LightGreen"
                                        >
                                            کلمه عبور خود را فراموش کردید؟
                                        </a>
                                    </div> */}

                                    {/* Sign Up Link */}
                                    <div className="text-center pt-4">
                                        <span className="text-TextWhite">
                                            حساب کاربری ندارید؟{" "}
                                        </span>
                                        <a
                                            href="signup"
                                            className="text-LightGreen "
                                        >
                                            ثبت نام
                                        </a>
                                    </div>
                                    {/* Sign In Button */}
                                    {!loading ?
                                        <button
                                            onClick={handleSubmit}
                                            className="w-full text-white absolute bottom-0 mb-0 bg-Blue hover:bg-LightGreen font-medium px-5 py-3 text-xl"
                                        >
                                            ورود
                                        </button>
                                        :
                                        <div className="w-full text-white absolute bottom-0 mb-0 bg-Blue text-center font-medium px-5 py-3 text-xl">
                                            <Spinner color="success" aria-label="Warning spinner example" />
                                        </div>
                                    }


                                </div>
                            </div>
                        </section>
                    </>
                } />
            </div>
        </AnimatedHeader>
    )
}
export default Login;
