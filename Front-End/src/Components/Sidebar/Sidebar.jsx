import { Sidebar } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer } from "flowbite-react";
import { FaInstagram } from "react-icons/fa";
import { RiEmotionLaughLine, RiMenuUnfold4Line } from "react-icons/ri";
import { GoSignOut } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { IoIosCloudOutline } from "react-icons/io";

export function MySidebar() {
  const navigate = useNavigate()
  const currentPage = (window.location.href.substring(window.location.href.lastIndexOf('/') + 1))
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>

      <button className=" border rounded-xl  bg absolute bg-gray-200 hover:bg-TextWhite  hover top-[5vh] right-[1vw] z-40 p-[10px]  " onClick={() => setIsOpen(true)}><RiMenuUnfold4Line className="text-4xl text-black " /> </button>

      <Drawer className=" bg-TextWhite pt-0 w-1/5" open={isOpen} onClose={handleClose} position="right">
        <Drawer.Header title="" titleIcon={() => <></>} />
        <Drawer.Items>
          <Sidebar className="m-auto shadow-darker-shadow-left h-[90vh] w-auto [&>div]:bg-TextWhite flex-initial" aria-label="Sidebar with multi-level dropdown example">
            <div className="flex items-center my-10">
              <div>
                <CgProfile className="text-4xl mr-2  text-black " />
              </div>
              <div className="mr-5 font-bold text-xl">
                خوش آمدید!
              </div>
            </div>

            {/*NPD*/}
            <Sidebar.Items>
              <Sidebar.ItemGroup className="border-r-2 text-sm p-2 bg-TextWhite border-gray-500 rounded-lg ">
                <Sidebar.Collapse className={`${(currentPage === "wordCloud" || currentPage === "main") ? " !bg-LightGreen" : "bg-transparent"} mt-4 [&>span]:text-right [&>span]:mr-3  text-black border border-transparent  [&>svg]:!text-black  hover:bg-transparent hover:border bg-TextWhite hover:border-gray-600 text-lg`}
                  label="تحلیل داده های اینستاگرام"
                  icon={FaInstagram}>
                  <Sidebar.Item
                    onClick={() => navigate("/main")}
                    className={`${currentPage === "main" ? "!bg-LightGreen" : "bg-transparent"} p-2 mr-7 text-base hover:cursor-pointer  [&>svg]:!text-black  text-black border border-transparent  [&_svg]:group-hover:text-black  hover:bg-transparent hover:border bg-TextWhite hover:border-gray-600 w-auto`}
                    icon={RiEmotionLaughLine}>
                    تحلیل احساسات متن
                  </Sidebar.Item>
                  <Sidebar.Item
                    onClick={() => navigate("/wordCloud")}
                    className={`${currentPage === "wordCloud" ? "!bg-LightGreen" : "bg-transparent"} p-2 mr-7 text-base hover:cursor-pointer  [&>svg]:!text-black  text-black border border-transparent  [&_svg]:text-black hover:bg-transparent hover:border bg-TextWhite hover:border-gray-600 w-auto`}
                    icon={IoIosCloudOutline}>
                    ابر کلمه
                  </Sidebar.Item>
                </Sidebar.Collapse>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
            <Sidebar.ItemGroup className="!border-black">
              <Sidebar.Item
                onClick={() => {
                  localStorage.removeItem("token")
                  navigate("/login")
                }}
                className=" text-black border hover:cursor-pointer border-transparent  [&_svg]:text-black hover:bg-transparent hover:border bg-TextWhite hover:border-gray-600 text-lg"
                icon={GoSignOut}>
                خروج
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
