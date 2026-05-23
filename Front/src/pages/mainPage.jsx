import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Button, Spinner, Tooltip } from "flowbite-react";
import DatePicker from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_fa from "react-date-object/locales/gregorian_fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MyTable } from "../Components/Table/Table.jsx";
import { MyPagination } from "../Components/Table/Pagination.jsx";
import { MyDropDown } from "../Components/DropDown/DropDown.jsx";
import { customTooltipTheme, sentimentMapper, toJalaliString } from "../Components/globalServices.js";
import PostInfoModal from "../Components/Modal/PostInfoModal.jsx";
import { localRequest } from "../configs/axiosService.js";
import { RiFileExcel2Fill } from "react-icons/ri";
import { FaFileCsv } from "react-icons/fa";

const MainPage = () => {
  const [totalPages, setTotalPages] = useState(false);
  const [totalResults, setTotalResults] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [postId, setPostId] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [caption, setCaption] = useState("");
  const [sentiment, setSentiment] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    handleSearch(1);
  }, []);

  const createTableData = (data) => {
    let tableRecords = [];

    data?.map((post) => {
      let obj = {};
      obj["id"] = post.id;
      obj["caption"] = post.caption;
      obj["url"] = post.url;
      obj["owner"] = post.owner;
      obj["likes"] = post.likes;
      obj["comments_count"] = post.comments_count;
      obj["post_date"] = post.post_date;
      obj["sentiment_overall"] = post.sentiment_overall;
      tableRecords.push(obj);
    });
    setTableData(tableRecords);
  };

  const handleSearch = (page) => {
    const formattedFromDate = toJalaliString(fromDate);
    const formattedToDate = toJalaliString(toDate);
    const sentimentParam = sentiment.length > 0
      ? sentiment.map(s => sentimentMapper(s)).join(',')
      : undefined;

    localRequest
      .get("posts/", {
        params: {
          page: page,
          from_date: formattedFromDate,
          to_date: formattedToDate,
          search: caption,
          sentiment: sentimentParam,
        },
      })
      .then((res) => {
        createTableData(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 10));
        setTotalResults(res.data.count);
      })
      .catch((error) => {
        console.error(error);
      });;
  };
  const handleFileDownload = (type) => {
    setLoading(true)
    const formattedFromDate = toJalaliString(fromDate);
    const formattedToDate = toJalaliString(toDate);
    const sentimentParam = sentiment.length > 0
      ? sentiment.map(s => sentimentMapper(s))
      : [];

    localRequest
      .post("posts-export/", {
          from_date: formattedFromDate,
          to_date: formattedToDate,
          search: caption,
          sentiment: sentimentParam,
          format: type        
      })
      .then((res) => {
        const { file_base64, filename, mime } = res.data;
        const byteCharacters = atob(file_base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], { type: mime });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });;
  };

  return (
    <div className="flex-col">
      <div className="bg-DarkBlue bg-no-repeat bg-center bg-cover min-h-[100vh] ">
        <div className="pt-[2vh] mx-auto w-[100%]">
          <div className="pt-[2vh]">
            <div className="m-auto text-center text-2xl text-TextWhite font-bold mb-10">
              تحلیل احساسات متن
            </div>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-3 my-14 gap-4">
            <div className="m-auto">
              <label className="m-auto text-gray-300 text-lg text-nowrap ml-2">
                از تاریخ:
              </label>
              <DatePicker
                calendar={gregorian}
                locale={gregorian_fa}
                value={fromDate}
                onChange={setFromDate}
                format="YYYY/MM/DD"
                maxDate={toDate}
                placeholder="از تاریخ"
                style={{
                  width: "200px",
                  height: "40px",
                  fontSize: "16px",
                  padding: "8px",
                }}
              />
            </div>
            <div className="m-auto">
              <label className="m-auto text-gray-300 text-lg text-nowrap ml-2">
                تا تاریخ:
              </label>
              <DatePicker
                calendar={gregorian}
                locale={gregorian_fa}
                value={toDate}
                onChange={setToDate}
                format="YYYY/MM/DD"
                minDate={fromDate}
                placeholder="تا تاریخ"
                style={{
                  width: "200px",
                  height: "40px",
                  fontSize: "16px",
                  padding: "8px",
                }}
              />
            </div>
            <Button
              onClick={() => handleSearch(1)}
              className="m-auto w-1/2 bg-LightGreen text-black hover:!bg-Blue hover:text-TextWhite"
            >
              <span className="m-auto text-base">جستجو</span>
              <IoSearch className="mr-2 m-auto text-3xl" />
            </Button>
            <div className="flex max-w-lg m-auto col-span-2">
              <label className="m-auto text-gray-300 text-lg text-nowrap ml-2">
                احساس کپشن:
              </label>
              <MyDropDown
                title="انتخاب احساس"
                options={["شادی", "غم", "عصبانیت", "ترس", "عشق", "تعجب"]}
                selectedOptions={sentiment}
                onchange={setSentiment}
              />
            </div>

            <div className="flex max-w-lg">
              <label className="m-auto text-gray-300 text-lg text-nowrap ml-2">
                کپشن:
              </label>
              <input
                className="shadow border rounded-lg w-full py-2 px-3 text-gray-700"
                id="search"
                type="text"
                placeholder="کپشن را وارد کنید"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
          {tableData?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 mx-52 my-12">
                {
                  loading ? (
                    <>
                      <Button className="m-auto w-1/2 bg-LightGreen text-black" disabled>
                        <Spinner size="md" color="gray" />
                      </Button>
                      <Button className="m-auto w-1/2 bg-LightGreen text-black" disabled>
                        <Spinner size="md" color="gray" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => { handleFileDownload("csv") }}
                        className="m-auto w-1/2 bg-LightGreen text-black hover:!bg-Blue hover:text-TextWhite"
                      >
                        <FaFileCsv className="m-auto text-2xl ml-3" />
                        <span className="m-auto text-base">دانلود نتایج به صورت csv</span>

                      </Button>
                      <Button
                        onClick={() => { handleFileDownload("xlsx") }}
                        className="m-auto w-1/2 bg-LightGreen text-black hover:!bg-Blue hover:text-TextWhite"
                      >
                        <RiFileExcel2Fill className="m-auto text-2xl ml-3" />
                        <span className="m-auto text-base">دانلود نتایج به صورت اکسل</span>
                      </Button>
                    </>
                  )
                }
              </div>
              <MyTable
                data={tableData}
                staticHeader="امکانات"
                staticColumns={[
                  {
                    content: (row) => (
                      <Tooltip
                        theme={customTooltipTheme}
                        content={"جزئیات پست"}
                      >
                        <IoMdInformationCircleOutline className=" text-3xl" onClick={() => {
                          setOpenModal(true)
                          setPostId(row["id"])
                        }
                        } />
                      </Tooltip>
                    ),

                  },
                ]}
              />
              <MyPagination
                totalResults={totalResults}
                totalPages={totalPages}
                handleSearch={handleSearch}
              />
            </>
          ) : (
            <div className="mx-auto block text-center text-TextWhite">
              رکوردی یافت نشد
            </div>
          )}
          {openModal ? (
            <PostInfoModal
              postId={postId}
              setOpenModal={setOpenModal}
              openModal={openModal}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
