import React, { useState } from "react";
import axios from "axios";
import Card from "components/card";
import { MdImage } from "react-icons/md";
import { Button, Input, Typography, Alert } from "@material-tailwind/react";
import Cookies from "universal-cookie";

const Insert = () => {
  const [formData, setFormData] = useState({
    cover: "",
    name: "",
    desc: "",
  });

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const cookies = new Cookies();

  const [fileInputText, setFileInputText] = useState("Choose a file");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, cover: file }));
    setFileInputText(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("cover", formData.cover);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("desc", formData.desc);

    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      await axios.post(
        "http://localhost:8000/api/item/create",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${cookies.get("Authorization")}`,
          },
          withCredentials: true,
        }
      );

      setAlertOpen(true);
      setAlertType("green");
      setAlertMessage("New item has been successfully added.");

      setTimeout(() => {
        setAlertOpen(false);
        clearForm();
      }, 3000);
    } catch (error) {
      console.error(error);
      setAlertOpen(true);
      setAlertType("red");
      setAlertMessage("Failed to add a new item.");

      setTimeout(() => {
        setAlertOpen(false);
        clearForm();
      }, 3000);
    }
  };

  const clearForm = () => {
    setFormData({
      cover: "",
      name: "",
      desc: "",
    });
    setFileInputText("Choose a file");
  };

  return (
    <Card extra={"w-full h-full p-4"}>
      <Alert
        className="w-33p"
        color={alertType}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      >
        {alertMessage}
      </Alert>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
        <Card className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-3 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
          <div className="col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6">
            <label
              htmlFor="chooseCover"
              className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0"
            >
              <MdImage className="text-[80px] text-brand-500 dark:text-white" />
              <h4 className="text-xl font-bold text-brand-500 dark:text-white">
                Choose Cover
              </h4>
              <p className="mt-2 text-sm font-medium text-gray-600">
                PNG, JPG and GIF files are allowed
              </p>
            </label>
            <input
              id="chooseCover"
              type="file"
              accept="image/png, image/jpeg, image/gif"
              className="hidden"
              onChange={handleCoverChange}
            />
            <span className="mt-2 text-sm font-medium text-gray-600">
              {fileInputText}
            </span>
          </div>
        </Card>
        <Typography variant="small" color="blue-gray" className="font-medium">
          Name
        </Typography>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter the item's name"
        />
        <Typography variant="small" color="blue-gray" className="font-medium">
          Description
        </Typography>
        <Input
          type="text"
          name="desc"
          value={formData.desc}
          onChange={handleChange}
          placeholder="Enter the item's description"
        />
        <Button type="submit">Add Item</Button>
      </form>
    </Card>
  );
};

export default Insert;
