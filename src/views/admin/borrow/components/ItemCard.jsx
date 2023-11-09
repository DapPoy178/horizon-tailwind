import React from "react";
import Card from "components/card";
import { Chip } from "@material-tailwind/react";
import axios from "axios";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ItemCard = ({ name, status, desc, image, extra, id }) => {
  const cookies = new Cookies();

  const handleBorrow = async () => {
    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      const borrowPromise = axios.post(
        `http://localhost:8000/api/item/borrow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${cookies.get("Authorization")}`,
          },
          withCredentials: true,
        }
      );

      toast.promise(
        borrowPromise,
        {
          pending: {
            render() {
              return "Processing...";
            },
            icon: false,
          },
          success: {
            render({ data }) {
              return `Borrowing item successfuly`;
            },
            // other options
            icon: "🟢",
          },
          error: {
            render({ data }) {
              // When the promise rejects, data will contain the error
              return `Error: ${data.response.error.message}`;
            }
          }
        }
      );

      // window.location.reload();
    } catch (error) {
      console.log("Error borrowing item:", error);
      // Handle error scenarios
    }
  };

  return (
      <Card
        extra={`flex flex-col w-full h-full !p-4 3xl:p-[18px] bg-white ${extra}`}
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
                {name}
              </p>

              <div className="flex flex-row mt-2 items-center">
                <p className="text-sm font-medium text-navy-700 dark:text-white">
                  Status:
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
                {desc}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-2 md:flex-row md:items-start lg:flex-row lg:justify-end lg:gap-x-2 xl:flex-row 2xl:items-start 3xl:flex-row 3xl:items-center 3xl:justify-end xl:gap-x-2">
            <button
              onClick={handleBorrow}
              className="rounded-xl bg-brand-500 p-2 text-sm font-medium text-white transition duration-200 hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-400 dark:text-white dark:hover:bg-yellow-300 dark:active:bg-yellow-200"
            >
              Borrow
            </button>
          </div>
        </div>
      </Card>
  );
};

export default ItemCard;
