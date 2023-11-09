import { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "./components/ItemCard";
import Cookies from "universal-cookie";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Borrowed = () => {
  const [itemData, setItemData] = useState([]);
  const cookies = new Cookies();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get CSRF cookie for authorization
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
          withCredentials: true,
        });
  
        // Make an API request to fetch the data
        const response = await axios.get("http://localhost:8000/api/borrowed", {
          headers: {
            Authorization: `Bearer ${cookies.get("Authorization")}`,
          },
          withCredentials: true,
        });
        setItemData(response.data.log);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [cookies]);

  return (
    <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-4">
      {itemData.map((items, index) => (
        <ItemCard
          key={index}
          name={items.item.name}
          desc={items.item.desc}
          status={items.item.status}
          image={items.item.cover}
          id={items.id}
        />
      ))} 
      <ToastContainer />
    </div>
  );
};

export default Borrowed;
