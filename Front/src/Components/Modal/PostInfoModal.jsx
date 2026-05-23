import { Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { localRequest } from "../../configs/axiosService.js";

export default function PostInfoModal({ postId, openModal, setOpenModal }) {
  const [detailData, setdetailData] = useState([]);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = () => {
    localRequest
      .get("posts/detail/" + postId + "/")
      .then((res) => {
        setdetailData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        size="5xl"
      >
        <Modal.Header
          dir="ltr"
          className="bg-gray-300 flex-row-reverse [&>h3]:text-lg [&>h3]:font-semibold dark:[&>h3]:text-gray-100 [&>h3]:text-black [&>h3]:ml-auto [&>button]:mr-auto [&>button]:ml-0 [&>button]:text-black "
        >
          {"جزئیات پست " + postId}
        </Modal.Header>
        <Modal.Body className="bg-gray-300 p-0" dir="ltr">
          <div className="text-center my-10 border-2 max-w-4xl m-auto p-5 rounded-xl border-black">
            {
              <div className="grid grid-cols-1 gap-y-10 text-left">
                <div className="text-base text-gray-700">
                  <span className="font-bold"> Tags:</span>
                  <div className="grid grid-cols-4">
                    {detailData.tags?.map((tag, index) => (
                      <span className="px-5">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="text-base text-gray-700">
                  <span className="font-bold"> Top comments:</span>
                  <div className="grid grid-cols-1">
                    {detailData.top_comments?.map((comment, index) => (
                      <span className="px-5">{comment}</span>
                    ))}
                  </div>
                </div>
                <div>

                  <span className="font-bold text-gray-700"> Emotion predictions:</span>
                <div className="grid grid-cols-4 gap-5">
                  <div className="text-base text-gray-700">
                    <span className="font-bold">lstm: </span>
                    {detailData.lstm_prediction}
                  </div>
                  <div className="text-base text-gray-700">
                    <span className="font-bold">random forest: </span>
                    {detailData.rf_prediction}
                  </div>
                  <div className="text-base text-gray-700">
                    <span className="font-bold">svm: </span>
                    {detailData.svm_prediction}
                  </div>
                  <div className="text-base text-gray-700">
                    <span className="font-bold">decision tree: </span>
                    {detailData.dt_prediction}
                  </div>
                  <div className="text-base text-gray-700">
                    <span className="font-bold">linear regression: </span>
                    {detailData.lr_prediction}
                  </div>
                  <div className="text-base text-gray-700">
                    <span className="font-bold">sentiment_overall: </span>
                    {detailData.sentiment_overall}
                  </div>
                </div>
                </div>

              </div>
            }
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
