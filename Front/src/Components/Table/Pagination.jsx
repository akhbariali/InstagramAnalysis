import { Pagination } from "flowbite-react";
import { useEffect, useState } from "react";

export function MyPagination({ totalPages, handleSearch, totalResults }) {
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page) => {
    setCurrentPage(page)
  };

  useEffect(() => {
    handleSearch(currentPage)
  }, [currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [totalResults])

  const CustomFlowbiteTheme = {
    "base": "",
    "layout": {
      "table": {
        "base": "text-sm dark:text-gray-700 text-gray-400 ",
        "span": "font-semibold dark:text-gray-900 text-gray-600"
      }
    },
    "pages": {
      "base": "xs:mt-0 mt-2 inline-flex items-center -space-x-px",
      "showIcon": "inline-flex",
      "previous": {
        "base": "ml-0 rounded-l-lg border text-nowrap dark:border-gray-300 border-gray-600 dark:bg-white bg-gray-100 px-3 py-2 leading-tight dark:text-gray-700 text-black enabled:dark:hover:bg-gray-100 enabled:hover:bg-gray-400 enabled:dark:hover:text-gray-700 enabled:hover:text-black",
        "icon": "h-5 w-5"
      },
      "next": {
        "base": "rounded-r-lg border text-nowrap dark:border-gray-300 border-gray-600 dark:bg-white bg-gray-100 px-3 py-2 leading-tight dark:text-gray-700 text-black enabled:dark:hover:bg-gray-100 enabled:hover:bg-gray-400 enabled:dark:hover:text-gray-700 enabled:hover:text-black ",
        "icon": "h-5 w-5"
      },
      "selector": {
        "base": "w-12 border dark:border-gray-300 border-gray-600 dark:bg-gray-700 bg-gray-300 py-2 leading-tight dark:text-white text-black enabled:dark:hover:bg-gray-100 enabled:hover:bg-gray-400 enabled:dark:hover:text-black enabled:hover:text-black ",
        "active": "dark:bg-gray-300 bg-gray-100 dark:text-black text-black dark:hover:bg-gray-300 hover:bg-gray-600 dark:hover:text-black hover:text-black",
        "disabled": "cursor-not-allowed opacity-50"
      }
    }
  }

  return (
    <div className="grid-cols-5 grid">
      <div className="m-auto text-TextWhite text-lg font-bold">
        تعداد کل صفحات: {totalPages}
      </div>
      <div className="max-w-lg mx-auto my-4 text-center col-span-3" dir="ltr">
        <Pagination theme={CustomFlowbiteTheme} className="" layout="pagination" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} showIcons previousLabel="صفحه قبل" nextLabel="صفحه بعد" />
      </div>
      <div className="m-auto text-TextWhite text-lg font-bold">
        تعداد کل نتایج: {totalResults}
      </div>
    </div>
  );
}
