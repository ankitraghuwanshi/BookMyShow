import React from "react";
import { useSelector } from "react-redux";
import { Spin } from "antd";

const Loader = () => {
  const { loading } = useSelector((state) => state.loaders);

  if (!loading) return null;

  return (
    <div className="fixed top-24 right-8 z-100">
      <Spin />
    </div>
  );
};

export default Loader;