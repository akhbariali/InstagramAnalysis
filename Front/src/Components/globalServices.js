import moment from "moment/moment";
import { Bounce, toast } from "react-toastify";

export const PersianDateTime = (timestamp) => {
  // var dateStr =  timestamp?.substring(0, 5).split("-").reverse().join("-") +
  // timestamp?.substring(5);

  const eventDate = moment(timestamp, "YYYY-MM-DD HH:mm:ss").toDate();

  const utcPlus3_30 = new Date(eventDate.getTime() + 3.5 * 60 * 60 * 1000);

  const persianDate = utcPlus3_30?.toLocaleDateString("fa-IR");
  const time = utcPlus3_30?.toLocaleTimeString("fa-IR");

  return { persianDate, time };
};

export const MyToast = (type, time, message) => {
  switch (type) {
    case "success":
      return toast.success(message, {
        position: "top-right",
        autoClose: time,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });

    case "error":
      return toast.error(message, {
        position: "top-right",
        autoClose: time,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });

    case "info":
      return toast.info(message, {
        position: "top-right",
        autoClose: time,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });

    default:
      return toast(message, {
        position: "top-right",
        autoClose: time,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
  }
};

export const customTooltipTheme = {
  arrow: {
    base: "absolute z-10 h-2 w-2 rotate-45",
    style: {
      dark: "bg-DarkBlue",
    },
  },
  style: {
    dark: "bg-DarkBlue text-TextWhite ",
  },
};

export const HeaderMapping = (header) => {
  let result = "";
  result = unitMapping(header);
  if (result === "") result = header;
  return result;
};

const unitMapping = (header) => {
  switch (header) {

    case "owner":
      return "مالک";
    case "likes":
      return "تعداد لایک ها";
    case "comments_count":
      return "تعداد کامنت ها";
    case "post_date":
      return "تاریخ پست";
    case "caption":
      return "کپشن";
    case "sentiment_overall":
      return "احساس کپشن";
    default:
      return "";
  }
};
export const sentimentMapper = (sentiment) => {
  switch (sentiment) {
    case "شادی":
      return "joy";
    case "غم":
      return "sadness";
    case "عصبانیت":
      return "anger";
    case "ترس":
      return "fear";
    case "تعجب":
      return "surprise";
    case "عشق":
      return "love";
    default:
      return "";
  }
};

export const toJalaliString = (date) => {
  if (!date) return "";
  const year = date.year;
  const month =
    date.month.number < 10 ? "0" + date.month.number : date.month.number;
  const day = date.day < 10 ? "0" + date.day : date.day;
  return `${year}-${month}-${day}T00:00:00`;
};

export const deviceState = (cell) => {
  return cell;
};
