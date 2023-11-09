import { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "./components/ItemCard";
import Cookies from "universal-cookie";

const Tables = () => {
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
        const response = await axios.get("http://localhost:8000/api/item", {
          headers: {
            Authorization: `Bearer ${cookies.get("Authorization")}`,
          },
          withCredentials: true,
        });
        setItemData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [cookies]);

  return (
    <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-4">
      {itemData.map((item, index) => (
        <ItemCard
          key={index}
          name={item.name}
          desc={item.desc}
          status={item.status}
          image={item.cover}
          id={item.id}
        />
      ))} 
    </div>
  );
};

export default Tables;
