import type { User } from "../../types/user.types";

interface Props {
  data: User[];
  loading?: boolean;
  showActions?: boolean; // ✅ Add this line
}

export const UsersTable = ({ data, loading, showActions }: Props) => {
  if (loading) return <p className="text-center py-6">Loading users...</p>;
  if (!data?.length) return <p className="text-center py-6">No users found</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-900 text-left text-gray-700 dark:text-gray-300">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Role</th>
            {showActions && <th className="p-3 text-right">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.map((user) => (
            <tr
              key={user.user_id}
              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <td className="p-3">{`${user.first_name} ${user.last_name}`}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.phone_number}</td>
              <td className="p-3">{user.role}</td>

              {showActions && (
                <td className="p-3 text-right space-x-2">
                  <button className="text-blue-600 hover:underline">
                    Approve
                  </button>
                  <button className="text-red-600 hover:underline">
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
