import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../store/userSlice';
import { RootState, AppDispatch } from '../store/index';
import Pagination from './Pagination';

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.users);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  if (loading) return <div data-testid="loading-state">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6" data-testid="user-list-container">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Users List</h1>
      {users.length === 0 ? (
        <div className="text-center py-8" data-testid="empty-state">
          <p className="text-gray-500 text-lg">No users found.</p>
        </div>
      ) : (
        <>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm" data-testid="users-table">
            <thead data-testid="table-header">
              <tr className="bg-gray-100">
                <th className="p-4 text-left font-semibold text-gray-700">First Name</th>
                <th className="p-4 text-left font-semibold text-gray-700">Last Name</th>
                <th className="p-4 text-left font-semibold text-gray-700">Email</th>
                <th className="p-4 text-left font-semibold text-gray-700">Created At</th>
              </tr>
            </thead>
            <tbody data-testid="table-body">
              {currentUsers.map(user => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors" data-testid={`user-row-${user._id}`}>
                  <td className="p-4 text-gray-800" data-testid="user-first-name">{user.firstName}</td>
                  <td className="p-4 text-gray-800" data-testid="user-last-name">{user.lastName}</td>
                  <td className="p-4 text-blue-600" data-testid="user-email">{user.email}</td>
                  <td className="p-4 text-gray-600" data-testid="user-created-at">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div data-testid="pagination-container">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
        </>
      )}
    </div>
  );
};

export default UserList;
