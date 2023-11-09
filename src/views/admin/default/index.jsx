import { MdCheckCircle, MdPerson, MdOutlineDoNotDisturbAlt, MdInventory } from "react-icons/md";

import {
  columnsDataComplex,
} from "./variables/columnsData";
// import tableDataComplex from "./variables/tableDataComplex.json";
import ComplexTable from "./components/ComplexTable";
import { useEffect, useState } from "react";
import axios from "axios";

import Widget from "components/widget/Widget";
import Cookies from "universal-cookie";

const Dashboard = () => {
  const [tableData, setTableData] = useState([]);
  const [itemTotal, setItemTotal] = useState([]);
  const [userTotal, setUserTotal] = useState([]);
  const [inUseTotal, setInUseTotal] = useState([]);
  const [availableTotal, setAvailableTotal] = useState([]);
  const cookies = new Cookies();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get CSRF cookie for authorization
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
          withCredentials: true,
        });
  
        // Make an API request to fetch the data
        const response = await axios.get("http://localhost:8000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${cookies.get("Authorization")}`,
          },
          withCredentials: true,
        });
  
        // Assuming the response data is an array of objects
        setItemTotal(response.data.item);
        setUserTotal(response.data.user);
        setInUseTotal(response.data.inUse);
        setAvailableTotal(response.data.available);
        setTableData(response.data.log);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [cookies]);

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-6">
        <Widget
          icon={<MdInventory className="h-7 w-7" />}
          title={"Item Total"}
          subtitle={itemTotal}
        />
        <Widget
          icon={<MdPerson className="h-6 w-6" />}
          title={"User Total"}
          subtitle={userTotal}
        />
        <Widget
          icon={<MdOutlineDoNotDisturbAlt className="h-7 w-7" />}
          title={"Borrowed Item"}
          subtitle={inUseTotal}
        />
        <Widget
          icon={<MdCheckCircle className="h-6 w-6" />}
          title={"Available Item"}
          subtitle={availableTotal}
        />
      </div>

      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">

        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableData}
        />
      </div>

    </div>
  );
};

export default Dashboard;
