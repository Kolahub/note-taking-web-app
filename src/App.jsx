// import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [{ path: "all-notes", element: <Dashboard />}, { path: "archive-notes", element: <Dashboard />}],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
