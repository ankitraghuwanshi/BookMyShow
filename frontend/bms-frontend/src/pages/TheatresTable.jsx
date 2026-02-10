import { useState, useEffect, useCallback } from "react";
import { getAllTheatres, updateTheatre } from "../api/theatre";
import { showLoading, hideLoading } from "../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { message, Button, Table } from "antd";

const TheatresTable = () => {
  const [theatres, setTheatres] = useState([]);
  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    try {
      dispatch(showLoading());
      const response = await getAllTheatres();

      if (response.success) {
        setTheatres(
          response.allTheatres.map((item) => ({
            ...item,
            key: `theatre-${item._id}`,
          }))
        );
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || "Failed to fetch theatres");
    } finally {
      dispatch(hideLoading());
    }
  }, [dispatch]);

  const handleStatusChange = async (theatre) => {
    try {
      dispatch(showLoading());

      const response = await updateTheatre({
        theatreId: theatre._id,
        isActive: !theatre.isActive,
      });

      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || "Failed to update theatre status");
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (_, data) => data.owner?.name || "—",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive) => (
        <span
          className={`font-medium ${
            isActive ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {isActive ? "Approved" : "Pending / Blocked"}
        </span>
      ),
    },
    {
      title: "Action",
      render: (_, data) => (
        <div className="flex items-center gap-3">
          {data.isActive ? (
            <Button danger onClick={() => handleStatusChange(data)}>
              Block
            </Button>
          ) : (
            <Button type="primary" onClick={() => handleStatusChange(data)}>
              Approve
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800">
        All Theatres
      </h2>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <Table
          dataSource={theatres}
          columns={columns}
          pagination={{ pageSize: 6 }}
        />
      </div>
    </div>
  );
};

export default TheatresTable;