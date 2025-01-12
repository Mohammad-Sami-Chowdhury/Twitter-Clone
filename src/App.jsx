import { useState } from "react";
import "./App.css";
import Profile from "./components/profile/Profile";
import Sidebar from "./components/Sidebar/Sidebar";
import Registration from "./page/registration/Registration";
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Registration />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/sidebar" element={<Sidebar />}></Route>
    </>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
