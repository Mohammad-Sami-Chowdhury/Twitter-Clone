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
import firebaseConfig from "./components/firebase/firebase.config";
import Home from "./page/home/Home";
import Login from "./page/login/login";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />}></Route>
      <Route path="/home" element={<Home />}></Route>
      <Route path="/registration" element={<Registration />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
    </>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
