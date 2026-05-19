import { useEffect, useState } from 'react';
import api from '../../api/client';
import { getLocalEnquiries, updateLocalEnquiry } from '../../services/localStore';

function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);

  const load = () => api.get('/enquiries')
    .then((res) => setEnquiries(res.data.enquiries))
    .catch(() => setEnquiries(getLocalEnquiries()));

  useEffect(() => {
    load();
    const syncLocal = () => setEnquiries(getLocalEnquiries());
    window.addEventListener('star-estates-data-change', syncLocal);
    return () => window.removeEventListener('star-estates-data-change', syncLocal);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/enquiries/${id}`, { status });
    } catch {
      updateLocalEnquiry(id, { status });
    }
    load();
  };

  return (
    <div className="admin-card">
      <div className="admin-section-head"><h2>Manage Enquiries</h2></div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Contact</th><th>Property</th><th>Message</th><th>Status</th></tr>
          </thead>
          <tbody>
            {enquiries.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.phone}<br />{item.email}</td>
                <td>{item.propertyTitle || 'General enquiry'}</td>
                <td>{item.message}</td>
                <td>
                  <select value={item.status} onChange={(e) => updateStatus(item._id, e.target.value)}>
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Site Visit</option>
                    <option>Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminEnquiries;
