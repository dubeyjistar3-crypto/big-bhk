import { Building2, ClipboardList, IndianRupee, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../api/client';
import { getLocalStats } from '../../services/localStore';

function Dashboard() {
  const [stats, setStats] = useState({ properties: 0, enquiries: 0, activeListings: 0, pipelineValue: 0 });

  useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data.stats)).catch(() => setStats(getLocalStats()));
    const syncLocal = () => setStats(getLocalStats());
    window.addEventListener('star-estates-data-change', syncLocal);
    return () => window.removeEventListener('star-estates-data-change', syncLocal);
  }, []);

  return (
    <div className="admin-grid">
      <div className="stat-card"><Building2 /><span>Properties</span><strong>{stats.properties}</strong></div>
      <div className="stat-card"><ClipboardList /><span>Enquiries</span><strong>{stats.enquiries}</strong></div>
      <div className="stat-card"><Users /><span>Active listings</span><strong>{stats.activeListings}</strong></div>
      <div className="stat-card"><IndianRupee /><span>Pipeline value</span><strong>{Math.round((stats.pipelineValue || 0) / 10000000)} Cr</strong></div>
    </div>
  );
}

export default Dashboard;
