import { useEffect, useState } from "react";
import { localRequest } from "../configs/axiosService";
import { MyToast, sentimentMapper, toJalaliString } from "../Components/globalServices";
import DatePicker from "react-multi-date-picker";
import { IoSearch } from "react-icons/io5";
import { Button, Spinner } from "flowbite-react";
import { MyDropDown } from "../Components/DropDown/DropDown";
import { MyTable } from "../Components/Table/Table";
import { MyPagination } from "../Components/Table/Pagination";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_fa from "react-date-object/locales/gregorian_fa";
import WordCloudModal from "../Components/Modal/WordCloudModal";

export default function WordCloud() {
    const [imageUrl, setImageUrl] = useState('');
    const [totalPages, setTotalPages] = useState(false);
    const [totalResults, setTotalResults] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [caption, setCaption] = useState("");
    const [sentiment, setSentiment] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]); // Added dependency to correctly revoke URL when imageUrl changes

    const handleCheckboxChange = (id) => {
        setSelectedIds(prevIds => {
            if (prevIds.includes(id)) {
                return prevIds.filter(currentId => currentId !== id);
            } else {
                return [...prevIds, id];
            }
        });
    };

    const createTableData = (data) => {
        const tableRecords = data?.map(post => ({
            id: post.id,
            caption: post.caption,
            url: post.url,
            owner: post.owner,
            likes: post.likes,
            comments_count: post.comments_count,
            post_date: post.post_date,
            sentiment_overall: post.sentiment_overall,
        })) || [];
        setTableData(tableRecords);
    };

    const handleSearch = (page) => {
        // 2. Map sentiment array to a comma-separated string for the API
        const sentimentParam = sentiment.length > 0
            ? sentiment.map(s => sentimentMapper(s)).join(',')
            : undefined;

        localRequest
            .get("posts/", {
                params: {
                    page: page,
                    from_date: toJalaliString(fromDate),
                    to_date: toJalaliString(toDate),
                    search: caption,
                    sentiment: sentimentParam,
                },
            })
            .then((res) => {
                createTableData(res.data.results);
                setTotalPages(Math.ceil(res.data.count / 10));
                setTotalResults(res.data.count);
            });
    };
    const wordCloudSet = (ids) => {
        localRequest
            .post("wordcloud/", {
                ids: ids,
                width: 800,
                height: 400,
            }, {
                responseType: 'blob',
            })
            .then((res) => {
                const objectUrl = URL.createObjectURL(res.data);
                setImageUrl(objectUrl);
                setOpenModal(true);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching word cloud image:", error);
                setLoading(false); // Ensure loading stops on error
            });
    }

    const wordCloudAll = () => {
        if (tableData?.length > 0) {
            setLoading(true);
            // 2. Map sentiment array for the API here as well
            const sentimentParam = sentiment.length > 0
                ? sentiment.map(s => sentimentMapper(s)).join(',')
                : undefined;

            localRequest.get("post-ids/", {
                params: {
                    offset: 0,
                    limit: 10000,
                    from_date: toJalaliString(fromDate),
                    to_date: toJalaliString(toDate),
                    search: caption,
                    sentiment: sentimentParam,
                },
            })
                .then((res) => {
                    wordCloudSet(res.data.ids);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false); // Ensure loading stops on error
                });
        }
        else {
            MyToast("error", 2000, "رکوردی یافت نشد");
        }
    };
    const wordCloudSelected = () => {
        if (selectedIds.length === 0) {
            MyToast("error", 2000, "لطفا ابتدا حداقل یک پست را انتخاب کنید");
            return;
        }
        setLoading(true);
        wordCloudSet(selectedIds);
    };

    return (
        <div className="flex-col">
            <div className="bg-DarkBlue bg-no-repeat bg-center bg-cover min-h-[100vh] ">
                <div className="pt-[2vh] mx-auto w-[100%]">
                    <div className="pt-[2vh]">
                        <div className="m-auto text-center text-2xl text-TextWhite font-bold">
                            ابر کلمه
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-3 my-14 gap-4 md:grid-cols-3">
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
                            {/* 3. Updated DropDown props */}
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
                                        onClick={wordCloudAll}
                                        className="m-auto w-1/2 bg-LightGreen text-black hover:!bg-Blue hover:text-TextWhite"
                                    >
                                        <span className="m-auto text-base">مشاهده ابر کلمه همه نتایج</span>
                                    </Button>
                                    <Button
                                        onClick={wordCloudSelected}
                                        className="m-auto w-1/2 bg-LightGreen text-black hover:!bg-Blue hover:text-TextWhite"
                                    >
                                        <span className="m-auto text-base">مشاهده ابر کلمه پست های انتخاب شده</span>
                                    </Button>
                                </>
                            )
                        }
                    </div>
                    {tableData?.length > 0 ? (
                        <>
                            <MyTable
                                data={tableData}
                                staticHeader="انتخاب"
                                staticColumns={[
                                    {
                                        content:
                                            (row) => (
                                                <input
                                                    type="checkbox"
                                                    className="border-LightGreen border-2 rounded-md m-auto w-5 h-5 bg-transparent mr-auto checked:!bg-LightGreen"
                                                    checked={selectedIds.includes(row.id)}
                                                    onChange={() => handleCheckboxChange(row.id)}
                                                />
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
                    {openModal && ( // Simplified conditional rendering
                        <WordCloudModal
                            imageUrl={imageUrl}
                            setOpenModal={setOpenModal}
                            openModal={openModal}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}