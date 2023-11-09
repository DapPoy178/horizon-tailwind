import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/logs";
import Insert from "views/admin/additems";
import DataTables from "views/admin/items";
import Borrow from "views/admin/borrow";
import Borrowed from "views/admin/return";
import User from "views/admin/user";
import Add from "views/admin/add";
import EditItem from "views/admin/edititems";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdListAlt,
  MdInventory,
  MdPeople,
  MdAddBox,
  MdPersonAddAlt1,
} from "react-icons/md";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "All Item",
    layout: "/admin",
    icon: <MdInventory className="h-6 w-6" />,
    path: "all-item",
    component: <DataTables />,
  },
  {
    name: "Borrowed Item",
    layout: "/admin",
    icon: <MdInventory className="h-6 w-6" />,
    path: "borrowed-item",
    component: <Borrowed />,
  },
  {
    name: "Borrow Item",
    layout: "/admin",
    icon: <MdInventory className="h-6 w-6" />,
    path: "borrow-item",
    component: <Borrow />,
  },
  {
    name: "Insert Item",
    layout: "/admin",
    icon: <MdAddBox className="h-6 w-6" />,
    path: "insert",
    component: <Insert />,
  },
  {
    name: "In n Out Log",
    layout: "/admin",
    path: "item-log",
    icon: <MdListAlt className="h-6 w-6" />,
    component: <NFTMarketplace />,
  },
  {
    name: "User",
    layout: "/admin",
    path: "user",
    icon: <MdPeople className="h-6 w-6" />,
    component: <User />,
  },
  {
    name: "Add User",
    layout: "/admin",
    path: "add",
    icon: <MdPersonAddAlt1 className="h-6 w-6" />,
    component: <Add />,
  },
  {
    layout: "/auth",
    path: "sign-in",
    component: <SignIn />,
  },
  {
    layout: "/admin",
    path: "edit-item/:id",
    component: <EditItem />,  
  },
  
];
export default routes;
