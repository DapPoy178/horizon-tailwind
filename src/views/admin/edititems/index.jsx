import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Card from 'components/card';
import { MdImage } from 'react-icons/md';
import { Button, Input, Typography, Alert } from '@material-tailwind/react';
import Cookies from 'universal-cookie';

const EditItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    cover: '',
  });

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const cookies = new Cookies();

  const [fileInputText, setFileInputText] = useState('Choose a file');

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
          withCredentials: true,
        });

        const response = await axios.get(`http://localhost:8000/api/item/edit/${id}`, {
          headers: {
            Authorization: `Bearer ${cookies.get('Authorization')}`,
          },
          withCredentials: true,
        });

        const { name, desc, cover } = response.data.data;
        setFormData({ name, desc, cover });
        if (cover) {
          setFileInputText(cover);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, cookies]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, cover: file }));
    setFileInputText(file ? file.name : 'Choose a file');
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData((prevData) => ({ ...prevData, name: newName }));
  };

  const handleDescChange = (e) => {
    const newDesc = e.target.value;
    setFormData((prevData) => ({ ...prevData, desc: newDesc }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append the cover if it exists
    if (formData.cover) {
      data.append('cover', formData.cover);
    }

    // Append the name if it exists
    if (formData.name) {
      data.append('name', formData.name);
    }

    // Append the desc if it exists
    if (formData.desc) {
      data.append('desc', formData.desc);
    }

    data.append('_method', 'PUT');

    // Send the request
    try {
      await axios.post(`http://localhost:8000/api/item/edit/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${cookies.get('Authorization')}`,
        },
        withCredentials: true,
      });

      setAlertOpen(true);
      setAlertType('green');
      setAlertMessage('Item has been successfully updated.');
      setTimeout(() => {
        setAlertOpen(false);
        navigate('/admin/all-item');
      }, 3000);
    } catch (error) {
      console.error(error);
      setAlertOpen(true);
      setAlertType('red');
      setAlertMessage('Failed to update the item.');
      setTimeout(() => {
        setAlertOpen(false);
      }, 3000);
    }
  };

  return (
    <Card extra={'w-full h-full p-4'}>
      <Alert className="w-33p" color={alertType} open={alertOpen} onClose={() => setAlertOpen(false)}>
        {alertMessage}
      </Alert>
      <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
        <Card className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-3 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
          <div className="col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6">
            <label
              htmlFor="chooseCover"
              className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0"
            >
              <MdImage className="text-[80px] text-brand-500 dark:text-white" />
              <h4 className="text-xl font-bold text-brand-500 dark:text-white">Choose Cover</h4>
              <p className="mt-2 text-sm font-medium text-gray-600">PNG, JPG and GIF files are allowed</p>
            </label>
            <input
              id="chooseCover"
              type="file"
              accept="image/png, image/jpeg, image/gif"
              className="hidden"
              onChange={handleCoverChange}
            />
            <span className="mt-2 text-sm font-medium text-gray-600">{fileInputText}</span>
          </div>
        </Card>
        <Typography variant="small" color="blue-gray" className="font-medium">
          Name
        </Typography>
        <Input
          type="text"
          name="name"
          defaultValue={formData.name}
          onChange={handleNameChange}
          placeholder="Enter the item's name"
        />
        <Typography variant="small" color="blue-gray" className="font-medium">
          Description
        </Typography>
        <Input
          type="text"
          name="desc"
          defaultValue={formData.desc}
          onChange={handleDescChange}
          placeholder="Enter the item's description"
        />
        <Button type="submit">Update Item</Button>
      </form>
    </Card>
  );
};

export default EditItem;
