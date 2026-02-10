import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllTheatresByOwner } from "../api/theatre";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/loaderSlice";
import TheatreFormModal from "./TheatreFormModal";
import DeleteTheatreModal from "./DeleteTheatreModal";
import ShowModal from "./ShowModal";

const TheatreList = () => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [formType, setFormType] = useState("add");
  const [theatres, setTheatres] = useState([]);

  const getData = useCallback(async () => {
    try {
      dispatch(showLoading());
      const response = await getAllTheatresByOwner({ owner: user._id });

      if (response.success) {
        setTheatres(
          response.allTheatresByOwner.map((item) => ({
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
  }, [dispatch, user._id]);

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
      title: "Actions",
      render: (_, data) => (
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setIsModalOpen(true);
              setFormType("edit");
              setSelectedTheatre(data);
            }}
          >
            <EditOutlined />
          </Button>

          <Button
            danger
            onClick={() => {
              setIsDeleteModalOpen(true);
              setSelectedTheatre(data);
            }}
          >
            <DeleteOutlined />
          </Button>

          {data.isActive && (
            <Button
              onClick={() => {
                setIsShowModalOpen(true);
                setSelectedTheatre(data);
              }}
            >
              + Shows
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Your Theatres
        </h2>

        <Button
          type="primary"
          onClick={() => {
            setIsModalOpen(true);
            setFormType("add");
            setSelectedTheatre(null);
          }}
        >
          Add Theatre
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <Table
          dataSource={theatres}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Modals */}
      {isModalOpen && (
        <TheatreFormModal
          isModalOpen={isModalOpen}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          setIsModalOpen={setIsModalOpen}
          formType={formType}
          getData={getData}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteTheatreModal
          isDeleteModalOpen={isDeleteModalOpen}
          selectedTheatre={selectedTheatre}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setSelectedTheatre={setSelectedTheatre}
          getData={getData}
        />
      )}

      {isShowModalOpen && (
        <ShowModal
          isShowModalOpen={isShowModalOpen}
          setIsShowModalOpen={setIsShowModalOpen}
          selectedTheatre={selectedTheatre}
        />
      )}
    </div>
  );
};

export default TheatreList;