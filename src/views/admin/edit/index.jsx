import Card from "components/card";
import React, { useState } from "react";
import { Button, Input, Typography, Alert } from "@material-tailwind/react";
import axios from "axios";

const Add = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:8000/api/user/create", formData)
      .then(response => {
        // Handle the response from the API
        console.log(response.data);
        setAlertOpen(true);
        setAlertType("green");
        setAlertMessage("New user has been successfully added.");
        setTimeout(() => {
          setAlertOpen(false);
          clearForm();
        }, 3000);
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error(error);
        setAlertOpen(true);
        setAlertType("red");
        setAlertMessage("Failed to add new user.");
        setTimeout(() => {
          setAlertOpen(false);
          clearForm();
        }, 3000);
      });
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: ""
    });
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
        <Typography
          variant="small"
          color="blue-gray"
          className="font-medium"
        >
          Name
        </Typography>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />
        <Typography
          variant="small"
          color="blue-gray"
          className="font-medium"
        >
          Email
        </Typography>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <Typography
          variant="small"
          color="blue-gray"
          className="font-medium"
        >
          Phone Number
        </Typography>
        <Input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />
        <Typography
          variant="small"
          color="blue-gray"
          className="font-medium"
        >
          Password
        </Typography>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
        <Button type="submit">Submit</Button>
      </form>
    </Card>
  );
};

export default Add;
