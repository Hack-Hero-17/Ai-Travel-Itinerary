import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App.jsx"
import './index.css'
import Header from "./components/ui/custom/Header";
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import CreateTrip from "./components/create-trip/index.jsx"
import { Toaster } from '@/components/ui/sonner.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/create-trip",
    element: <CreateTrip/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Header/>
    <Toaster />
    <RouterProvider router={router} />
  </React.StrictMode>
);
