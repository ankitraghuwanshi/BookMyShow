import React from "react";
import { Tabs } from "antd";
import MovieList from "./MovieList";
import TheatresTable from "./TheatresTable";

function Admin() {
  const tabItems = [
    {
      key: "1",
      label: "Movies",
      children: <MovieList />,
    },
    {
      key: "2",
      label: "Theatres",
      children: <TheatresTable />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Admin Dashboard
      </h1>

      {/* Tabs Container */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <Tabs
          items={tabItems}
          className="admin-tabs"
        />
      </div>
    </div>
  );
}

export default Admin;