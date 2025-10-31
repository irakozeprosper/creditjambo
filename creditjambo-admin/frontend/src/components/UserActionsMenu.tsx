import React, { useState } from "react";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

const UserActionsMenu: React.FC<Props> = ({ onEdit, onDelete, onView }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-2 py-1 border rounded hover:bg-gray-100"
      >
        Actions
      </button>

      {open && (
        <ul className="absolute right-0 mt-1 bg-white border rounded shadow-md w-36 z-10">
          <li onClick={onView} className="p-2 hover:bg-gray-100 cursor-pointer">
            View
          </li>
          <li onClick={onEdit} className="p-2 hover:bg-gray-100 cursor-pointer">
            Edit
          </li>
          <li
            onClick={onDelete}
            className="p-2 hover:bg-gray-100 cursor-pointer text-red-600"
          >
            Delete
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserActionsMenu;
