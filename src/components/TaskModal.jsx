import React, { useState, useEffect, useMemo } from "react";
import { PRIORITY_COLORS } from "../constants/colors";
import ConfirmDialog from "./ConfirmDialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskModal = ({ isOpen, onClose, task, onSave, onDelete }) => {
  // Default empty task wrapped in useMemo to avoid dependency changes on every render
  const defaultTask = useMemo(
    () => ({
      id: null,
      text: "",
      start: null,
      end: null,
      priority: "MEDIUM",
      description: "",
    }),
    []
  );

  // State for form data
  const [formData, setFormData] = useState(defaultTask);
  // State for confirm dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Update form when task changes
  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData(defaultTask);
    }
  }, [task, defaultTask]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.text.trim()) {
      toast.error("Tên nhiệm vụ không được để trống");
      return false;
    }
    if (formData.start && isNaN(new Date(formData.start).getTime())) {
      toast.error("Thời gian bắt đầu không hợp lệ");
      return false;
    }
    if (formData.end && isNaN(new Date(formData.end).getTime())) {
      toast.error("Thời gian kết thúc không hợp lệ");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (JSON.stringify(formData) === JSON.stringify(task)) {
      toast.info("Không có thay đổi để lưu");
      return;
    }

    try {
      onSave(formData);
      toast.success("OK");
      onClose();
    } catch (error) {
      toast.error("Sửa không thành công");
      console.error(error);
    }
  };

  // Handle delete request
  const handleDeleteRequest = () => {
    setShowConfirmDialog(true);
  };

  // Handle confirmed delete
  const handleConfirmedDelete = () => {
    onDelete(formData.id);
    onClose();
  };

  // Format date and time for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b">
            <h3 className="text-xl font-semibold text-gray-800">
              {task && task.id ? "Chỉnh sửa nhiệm vụ" : "Thêm nhiệm vụ mới"}
            </h3>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 space-y-4">
              {/* Task Name */}
              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên nhiệm vụ
                </label>
                <input
                  type="text"
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="start"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Thời gian bắt đầu
                  </label>
                  <input
                    type="text"
                    id="start"
                    value={formatDateTime(formData.start)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor="end"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Thời gian kết thúc
                  </label>
                  <input
                    type="text"
                    id="end"
                    value={formatDateTime(formData.end)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    disabled
                  />
                </div>
              </div>

              {/* Priority Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức độ ưu tiên
                </label>
                <div className="flex space-x-4">
                  {Object.entries(PRIORITY_COLORS).map(
                    ([key, { background }]) => (
                      <label
                        key={key}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={key}
                          checked={formData.priority === key}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full ${
                            formData.priority === key
                              ? "ring-2 ring-offset-2 ring-gray-400"
                              : ""
                          }`}
                          style={{ backgroundColor: background }}
                        />
                        <span className="text-sm">
                          {key === "HIGH"
                            ? "Cao"
                            : key === "MEDIUM"
                            ? "Trung bình"
                            : key === "LOW"
                            ? "Thấp"
                            : "Cố định"}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mô tả (không bắt buộc)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg flex justify-between items-center">
              <div>
                {task && task.id && (
                  <button
                    type="button"
                    onClick={handleDeleteRequest}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Xóa
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Lưu
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmedDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa nhiệm vụ này?"
      />
    </>
  );
};

export default TaskModal;
