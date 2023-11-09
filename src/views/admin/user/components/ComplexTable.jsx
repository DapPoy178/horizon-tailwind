// import CardMenu from "components/card/CardMenu";
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Card from "components/card";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import { useMemo } from "react";
// import Links from "./Links";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/modal";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import Cookies from 'universal-cookie';

const ComplexTable = (props) => {

  const { columnsData, tableData } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const cookies = new Cookies();


  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
  } = tableInstance;

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
      // Perform any additional actions after successful deletion
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
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          User list
        </div>
        {/* <button className="flex flex-row items-center rounded-xl bg-blue-500 px-4 py-3 text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-400 dark:text-white dark:hover:bg-blue-300 dark:active:bg-blue-200">
          <Links to={`edit-item`} />
        </button> */}
      </div>

      <div className="mt-8 overflow-x-scroll xl:overflow-hidden">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={index}
                    className="border-b border-gray-200 pr-28 pb-[10px] text-start dark:!border-navy-700"
                  >
                    <p className="text-xs tracking-wide text-gray-600">
                      {column.render("Header")}
                    </p>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = "";
                    if (cell.column.Header === "NAME" || cell.column.Header === "EMAIL" || cell.column.Header === "PHONE") {
                      data = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {cell.value}
                        </p>
                      );
                    } else if (cell.column.Header === "ACTION") {
                      data = (
                        <div className="flex flex-row gap-2">
                          <Link>
                            <button className="rounded-xl bg-blue-500 p-2 text-base font-medium text-white transition duration-200 hover:bg-yellow-600 active:bg-yellow-700 dark:bg-yellow-400 dark:text-white dark:hover:bg-yellow-300 dark:active:bg-yellow-200">
                              <MdInfoOutline />
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
                                        onClick={() => handleDelete(cell.value)}
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
                      );
                    }
                    return (
                      <td
                        className="pt-[14px] pb-[18px] sm:text-[14px]"
                        {...cell.getCellProps()}
                        key={index}
                      >
                        {data}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ComplexTable;
