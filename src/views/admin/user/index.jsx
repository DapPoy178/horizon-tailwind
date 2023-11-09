import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/modal";
import Card from "components/card";
import { Alert } from '@material-tailwind/react';
import Cookies from 'universal-cookie';

const User = () => {
  const [userData, setUserData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const cookies = new Cookies();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get CSRF cookie for authorization
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
          withCredentials: true,
        });
  
        // Make an API request to fetch the data
        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: `Bearer ${cookies.get("Authorization")}`,
          },
          withCredentials: true,
        });
        setUserData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [cookies]);

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      await axios.delete(`http://localhost:8000/api/user/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.get("Authorization")}`,
        },
        withCredentials: true,
      });
      setAlertOpen(true);
        setAlertType("green");
        setAlertMessage("Item has been successfully updated.");
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      } catch (error) {
        console.log("Error deleting item:", error);
        setAlertOpen(true);
        setAlertType("red");
        setAlertMessage("Failed to update the item.");
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      } finally {
        setIsLoading(false);
        setDeleteItemId(null);
        setIsDeleteModalOpen(false);
      }
      // window.location.reload();
  };

  const openDeleteModal = (id) => {
    setDeleteItemId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <Alert
          className="w-33p"
          color={alertType}
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
        >
          {alertMessage}
        </Alert>
        <Card extra="p-5">
          <table className="w-full">
            <thead>
              <tr>
                <th className="border-b border-gray-200 pr-28 pb-[10px] text-start dark:!border-navy-700">
                  <p className="text-xs tracking-wide text-gray-600">Name</p>
                </th>
                <th className="border-b border-gray-200 pr-28 pb-[10px] text-start dark:!border-navy-700">
                  <p className="text-xs tracking-wide text-gray-600">Email</p>
                </th>
                <th className="border-b border-gray-200 pr-28 pb-[10px] text-start dark:!border-navy-700">
                  <p className="text-xs tracking-wide text-gray-600">Phone</p>
                </th>
                <th className="border-b border-gray-200 pr-28 pb-[10px] text-start dark:!border-navy-700">
                  <p className="text-xs tracking-wide text-gray-600">Action</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user) => (
                <tr key={user.id}>
                  <td className="pt-[14px] pb-[18px] sm:text-[14px]">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">{user.name}</p>
                  </td>
                  <td className="pt-[14px] pb-[18px] sm:text-[14px]">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">{user.email}</p>
                  </td>
                  <td className="pt-[14px] pb-[18px] sm:text-[14px]">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">{user.phone}</p>
                  </td>
                  <td className="pt-[14px] pb-[18px] sm:text-[14px]">
                    <div className="flex flex-row gap-2">
                      <button className="rounded-xl bg-blue-500 p-2 text-base font-medium text-white transition duration-200 hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-400 dark:text-white dark:hover:bg-yellow-300 dark:active:bg-yellow-200">
                        <MdInfoOutline />
                      </button>
                      <button
                        className="rounded-xl bg-red-500 p-2 text-base font-medium text-white transition duration-200 hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-400 dark:text-white dark:hover:bg-yellow-300 dark:active:bg-yellow-200"
                        onClick={() => openDeleteModal(user.id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} className="!z-[1010]">
        <ModalOverlay className="bg-[#000] !opacity-30" />
        <ModalContent className="!z-[1002] !m-auto !w-max min-w-[350px] !max-w-[85%] md:top-[25vh]">
          <ModalBody>
            <Card extra="p-5 max-w-[450px] flex flex-col !z-[1004]">
              <h1 className="mb-[20px] text-2xl font-bold">Modal Title</h1>
              <p className="mb-[20px]">
                Are you sure to delete this item?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={closeDeleteModal}
                  className="linear rounded-xl border-2 border-red-500 px-5 py-3 text-base font-medium text-red-500 transition duration-200 hover:bg-red-600/5 active:bg-red-700/5 dark:border-red-400 dark:bg-red-400/10 dark:text-white dark:hover:bg-red-300/10 dark:active:bg-red-200/10"
                >
                  Close
                </button>
                <button
                  className="linear text-navy-700 rounded-xl bg-gray-100 px-5 py-3 text-base font-medium transition duration-200 hover:bg-gray-200 active:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/30"
                  onClick={() => handleDelete(deleteItemId)}
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
  );
};

export default User;
