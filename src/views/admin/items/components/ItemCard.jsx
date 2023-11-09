import Card from "components/card";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/modal";
import { Chip } from "@material-tailwind/react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import { useState } from "react"
import Cookies from "universal-cookie";

const ItemCard = ({ name, status, desc, image, extra, id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const cookies = new Cookies();

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      await axios.delete(`http://localhost:8000/api/item/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.get("Authorization")}`,
        },
        withCredentials: true,
      });

      onClose();
      window.location.reload();
    } catch (error) {
      console.log("Error deleting item:", error);
      // Handle error scenarios
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      extra={`flex flex-col w-full h-full !p-4 3xl:p-![18px] bg-white ${extra}`}
    >
      <div className="h-full w-full">
        <div className="relative w-full">
          <img
            src={image}
            className="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full"
            alt=""
          />
        </div>

        <div className="mb-3 flex items-center justify-between px-1 md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col xl:items-start 3xl:flex-row 3xl:justify-between">
          <div className="mb-2">
            <p className="text-lg font-bold text-navy-700 dark:text-white">
              {" "}
              {name}{" "}
            </p>

            <div className="flex flex-row mt-2 items-center">
              <p className="text-sm font-medium text-navy-700 dark:text-white">
                Status :
              </p>
              <div className={`rounded-full text-xl mx-2`}>
                {status === "Available" ? (
                  <Chip color="green" value={status} className="py-1" />
                ) : status === "in use" ? (
                  <Chip color="red" value={status} className="py-1" />
                ) : null}
              </div>
            </div>

            <p className="mt-1 text-sm font-medium text-gray-600 md:mt-2">
              {desc}{" "}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end er gap-x-2 md:flex-row md:items-start lg:flex-row lg:justify-end lg:gap-x-2 xl:flex-row 2xl:items-start 3xl:flex-row 3xl:items-center 3xl:justify-end xl:gap-x-2">
          <Link to={`/admin/edit-item/${id}`}>
            <button className="rounded-xl bg-yellow-500 p-2 text-base font-medium text-white transition duration-200 hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-400 dark:text-white dark:hover:bg-yellow-300 dark:active:bg-yellow-200">
              <MdModeEdit />
            </button>
          </Link>
          <div onClick={onOpen}>
            <button className="rounded-xl bg-red-500 p-2 text-base font-medium text-white transition duration-200 hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-400 dark:text-white dark:hover:bg-yellow-300 dark:active:bg-yellow-200">
              <MdDelete />
            </button>

            <Modal isOpen={isOpen} onClose={onClose} className="!z-[1010]">
              <ModalOverlay className="bg-[#000] !opacity-30" />
              <ModalContent className="!z-[1002] !m-auto !w-max min-w-[350px] !max-w-[85%] md:top-[25vh]">
                <ModalBody>
                  <Card extra="px-[30px] pt-[35px] pb-[40px] max-w-[450px] flex flex-col !z-[1004]">
                    <h1 className="mb-[20px] text-2xl font-bold">Modal Title</h1>
                    <p className="mb-[20px]">
                      Are you sure to delete this item?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={onClose}
                        className="linear rounded-xl border-2 border-red-500 px-5 py-3 text-base font-medium text-red-500 transition duration-200 hover:bg-red-600/5 active:bg-red-700/5 dark:border-red-400 dark:bg-red-400/10 dark:text-white dark:hover:bg-red-300/10 dark:active:bg-red-200/10"
                      >
                        Close
                      </button>
                      <button
                        className="linear text-navy-700 rounded-xl bg-gray-100 px-5 py-3 text-base font-medium transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/30"
                        onClick={handleDelete}
                        disabled={isLoading}
                      >
                        {isLoading ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </Card>
                </ModalBody>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
