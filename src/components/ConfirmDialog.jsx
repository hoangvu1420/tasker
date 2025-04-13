import React from 'react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dialog Header */}
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            {title || 'Xác nhận'}
          </h3>
        </div>

        {/* Dialog Body */}
        <div className="px-6 py-4">
          <p className="text-gray-700">
            {message || 'Bạn có chắc chắn muốn thực hiện hành động này?'}
          </p>
        </div>

        {/* Dialog Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
