import React, { useEffect, useState } from 'react';
import { IoEye, IoEyeOff } from "react-icons/io5";
import signupImg from "../assets/images/signup.png";
import LoginContainer from '../Components/Container/LoginContainer.jsx';
import { localRequest } from '../configs/axiosService.js';
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { MdEmail } from 'react-icons/md';
import { MyToast } from '../Components/globalServices.js';
import { Spinner } from 'flowbite-react';
import AnimatedHeader from '../Components/Container/AnimatedHeader.jsx';
import TypingTitle from '../Components/Title/typingTitle.jsx';

const SignUp = ({ setHasToken }) => {

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async () => {
        setLoading(true)
        const user = document.getElementById("username").value
        const pass = document.getElementById("password").value
        const email = document.getElementById("email").value

        // Validate username
        if (!user) {
            setLoading(false);
            MyToast("error", 2000, "نام کاربری نمی تواند خالی باشد");
            return;
        }

        // Validate password
        const passwordRegex = /^.{8,}$/;
        if (!passwordRegex.test(pass)) {
            setLoading(false);
            MyToast("error", 2000, "رمز عبور باید حداقل ۸ کاراکتر باشد");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setLoading(false);
            MyToast("error", 2000, "فرمت ایمیل نادرست است");
            return;
        }

        localRequest.post("api/auth/register/", {
            username: user,
            password: pass,
            email: email
        }).then(() => {
            MyToast("success", 2000, "حساب کاربری با موفقیت ایجاد شد")
            navigate("/login");
        }).catch(e => {
            setLoading(false)
            MyToast("error", 2000, "حساب کاربری با این ایمیل یا نام کاربری وجود دارد")
        })
    }

    return (
        <AnimatedHeader>
            <div className='grid grid-cols-2 gap-5 overflow-auto' dir='rtl'>

                <div className='m-auto'>
                    <TypingTitle titles={["سامانه تحلیل داده های شبکه اجتماعی"]} />
                </div>
                <LoginContainer element={
                    <>
                        <section
                            className="relative w-full backdrop-brightness-150 bg-white/30 h-[40vh] bg-cover bg-blend-lighten bg-center flex flex-col items-center justify-start"
                            style={{ backgroundImage: `url(${signupImg})` }}
                        >
                        </section>
                        <section
                            className="relative w-full h-[50vh] bg-cover bg-center flex flex-col items-center justify-start">
                            {/* Login Form */}
                            <div
                                className="w-full bg-transparent"
                                dir="ltr"
                            >
                                <div className="space-y-5 m-auto">
                                    {/* name Input */}
                                    <div className="relative mx-5 mt-3">
                                        <input
                                            type="username"
                                            name="username"
                                            id="username"
                                            className=" bg-DarkBlue placeholder-LightGreen text-xl text-center border-b-LightGreen border-b-2 outline-none text-LightGreen block w-full p-3"
                                            placeholder="نام"
                                            required=""
                                        />
                                        <div className="absolute inset-y-0 left-3 flex items-center">
                                            <FaUser className="text-LightGreen text-2xl" />
                                        </div>
                                    </div>
                                    {/* Email Input */}
                                    <div className="relative mx-5 mt-3">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className=" bg-DarkBlue placeholder-LightGreen text-xl text-center border-b-LightGreen border-b-2 border-transparent outline-none text-LightGreen block w-full p-3"
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

                                    {/* Sign Up Link */}
                                    <div className="text-center pt-4">
                                        <span className="text-TextWhite">
                                            حساب کاربری دارید؟{" "}
                                        </span>
                                        <a
                                            href="login"
                                            className="text-LightGreen "
                                        >
                                            ورود
                                        </a>
                                    </div>
                                    {/* Sign In Button */}
                                    {loading ?
                                        <div className="w-full text-white absolute bottom-0 mb-0 bg-Blue text-center font-medium px-5 py-3 text-xl">
                                            <Spinner color="success" aria-label="Warning spinner example" />
                                        </div>
                                        :
                                        <button
                                            onClick={handleSubmit}
                                            className="w-full text-white absolute bottom-0 bg-Blue hover:bg-LightGreen font-medium px-5 py-3 text-xl"
                                        >
                                            ثبت نام
                                        </button>
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
export default SignUp;
