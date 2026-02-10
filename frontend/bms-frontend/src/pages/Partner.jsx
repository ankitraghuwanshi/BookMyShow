import { Tabs } from "antd";
import TheatreList from "./TheatreList";

const Partner = () => {
  const items = [
    {
      key: "1",
      label: "Theatres",
      children: <TheatreList />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Partner Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your theatres and shows
        </p>
      </div>

      {/* Tabs Container */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default Partner;