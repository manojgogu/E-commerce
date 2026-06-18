import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { FiTrash2 } from 'react-icons/fi';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data);
  };

  useEffect(() => { load(); }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    toast.success('User deleted');
    load();
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">👥 Manage Users ({users.length})</h2>
      <div className="table-responsive card border-0 shadow-sm p-3">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td className="fw-semibold">{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>{u.role}</span>
                </td>
                <td><small>{new Date(u.createdAt).toLocaleDateString('en-IN')}</small></td>
                <td>
                  {u.role !== 'admin' && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(u._id)}>
                      <FiTrash2 />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
