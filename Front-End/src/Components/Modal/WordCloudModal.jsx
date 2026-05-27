import { Modal } from "flowbite-react";

export default function WordCloudModal({imageUrl, openModal, setOpenModal }) {

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
          {"مشاهده ابر کلمه"}
        </Modal.Header>
        <Modal.Body className="bg-gray-300 p-0" dir="ltr">
          <div className="flex justify-center my-10">
                {imageUrl && <img src={imageUrl} alt="Word Cloud" />}
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
