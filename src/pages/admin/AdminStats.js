import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../api/client';
import { defaultStats } from '../../data/defaultStats';
import { getLocalHomeStats, saveLocalHomeStats } from '../../services/localStore';

function AdminStats() {
  const [stats, setStats] = useState(() => getLocalHomeStats());
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/site-stats')
      .then((res) => setStats(res.data.stats.length ? res.data.stats : defaultStats))
      .catch(() => setStats(getLocalHomeStats()));
  }, []);

  const updateStat = (index, key, value) => {
    setStats((current) => current.map((stat, statIndex) => (
      statIndex === index ? { ...stat, [key]: key === 'value' ? Number(value) : value } : stat
    )));
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      const res = await api.put('/site-stats', { stats });
      setStats(res.data.stats);
      setMessage('Stats saved successfully.');
    } catch {
      saveLocalHomeStats(stats);
      setMessage('API/MongoDB abhi connected nahi hai. Stats is browser me locally save ho gaye hain.');
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-section-head">
        <h2>Update Home Counters</h2>
      </div>
      <form className="stats-admin-form" onSubmit={submit}>
        {stats.map((stat, index) => (
          <div className="stats-admin-row" key={stat.key}>
            <input value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)} placeholder="Label" />
            <input type="number" value={stat.value} onChange={(e) => updateStat(index, 'value', e.target.value)} placeholder="Value" />
            <input value={stat.suffix} onChange={(e) => updateStat(index, 'suffix', e.target.value)} placeholder="Suffix" />
          </div>
        ))}
        <button className="btn btn-primary" type="submit"><Save /> Save Counters</button>
      </form>
      {message && <p className="form-status">{message}</p>}
    </div>
  );
}

export default AdminStats;
