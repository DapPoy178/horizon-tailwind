import {
  columnsDataComplex,
} from "./variables/columnsData";
import ComplexTable from "./components/ComplexTable";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import axios from "axios";

const Marketplace = () => {
  const [tableData, setTableData] = useState([]);
  const cookies = new Cookies();


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get CSRF cookie for authorization
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
          withCredentials: true,
        });

        // Make an API request to fetch the data
        const response = await axios.get("http://localhost:8000/api/log", {
          headers: {
            Authorization: `Bearer ${cookies.get("Authorization")}`,
          },
          withCredentials: true,
        });

        // Assuming the response data is an array of objects
        setTableData(response.data.log);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [cookies]);

  return (
    <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-1 lg:grid-cols-1 2xl:grid-cols-1">

      <ComplexTable
        columnsData={columnsDataComplex}
        tableData={tableData}
      />

    </div>
  );
};

export default Marketplace;
