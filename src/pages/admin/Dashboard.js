import {
  BarChart3,
  Building2,
  CheckSquare,
  ClipboardList,
  Eye,
  Globe2,
  Home,
  Inbox,
  Lightbulb,
  Plus,
  Tag,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { getLocalStats } from '../../services/localStore';

const defaultStats = {
  properties: 0,
  enquiries: 0,
  newEnquiries: 0,
  activeListings: 0,
  totalViews: 0,
  pendingReview: 0,
  pipelineValue: 0,
  recentActivity: [],
};

function timeAgo(value) {
  if (!value) return 'Just now';
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hrs ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function iconFor(activity) {
  if (activity.icon === 'inbox') return <Inbox size={21} />;
  if (activity.icon === 'Villa') return <Home size={21} />;
  if (activity.icon === 'Plot') return <Tag size={21} />;
  return <Building2 size={21} />;
}

function Dashboard() {
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    const load = () => api.get('/admin/stats')
      .then((res) => setStats({ ...defaultStats, ...res.data.stats }))
      .catch(() => setStats({ ...defaultStats, ...getLocalStats() }));

    load();
    window.addEventListener('star-estates-data-change', load);
    return () => window.removeEventListener('star-estates-data-change', load);
  }, []);

  const cards = useMemo(() => ([
    {
      label: 'Total Properties',
      value: stats.properties,
      helper: `${Math.max(stats.properties - stats.activeListings, 0)} inactive listings`,
      icon: Building2,
      tone: 'violet',
    },
    {
      label: 'Total Views',
      value: Number(stats.totalViews || 0).toLocaleString('en-IN'),
      helper: 'Live traffic estimate',
      icon: Eye,
      tone: 'amber',
    },
    {
      label: 'New Enquiries',
      value: stats.enquiries,
      helper: `${stats.newEnquiries || 0} new leads`,
      icon: ClipboardList,
      tone: 'green',
    },
    {
      label: 'Active Listings',
      value: stats.activeListings,
      helper: `${stats.pendingReview || 0} pending review`,
      icon: CheckSquare,
      tone: 'rose',
    },
  ]), [stats]);

  const activity = stats.recentActivity?.length ? stats.recentActivity : [];

  return (
    <div className="admin-dashboard">
      <div className="admin-metric-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article className="admin-metric-card" key={card.label}>
              <div>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <small>{card.helper}</small>
              </div>
              <b className={card.tone}><Icon /></b>
            </article>
          );
        })}
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-panel recent-activity-panel">
          <div className="admin-panel-head">
            <h2><ClipboardList size={21} /> Recent Activity</h2>
            <Link to="/admin/enquiries">View All</Link>
          </div>
          <div className="activity-table">
            <div className="activity-row activity-head">
              <span>Property</span>
              <span>Activity</span>
              <span>Time</span>
              <span>Status</span>
            </div>
            {activity.length === 0 ? (
              <p className="empty-admin-state">No recent activity yet.</p>
            ) : activity.map((item) => (
              <div className="activity-row" key={item.id}>
                <div className="activity-property">
                  <b>{iconFor(item)}</b>
                  <span>
                    <strong>{item.property}</strong>
                    <small>{item.location}</small>
                  </span>
                </div>
                <p>{item.activity}</p>
                <p>{timeAgo(item.createdAt)}</p>
                <em className={`status-pill ${item.tone || 'info'}`}>{item.status}</em>
              </div>
            ))}
          </div>
        </section>

        <aside className="admin-side-stack">
          <section className="admin-panel quick-actions">
            <div className="admin-panel-head">
              <h2><Plus size={21} /> Quick Actions</h2>
            </div>
            <Link to="/admin/properties"><Plus /> Add New Property</Link>
            <Link to="/admin/enquiries"><Inbox /> View Enquiries ({stats.newEnquiries || 0} new)</Link>
            <Link to="/admin/stats"><BarChart3 /> See Analytics</Link>
            <Link to="/"><Globe2 /> View Live Website</Link>
          </section>

          <section className="admin-panel admin-tips">
            <div className="admin-panel-head">
              <h2><Lightbulb size={21} /> Tips to Boost Listings</h2>
            </div>
            <div>
              <strong>Upload 10+ photos</strong>
              <small>More photos improve enquiry quality.</small>
            </div>
            <div>
              <strong>Add detailed description</strong>
              <small>Mention landmarks, metro access and amenities.</small>
            </div>
            <div>
              <strong>Price competitively</strong>
              <small>Check nearby project rates before publishing.</small>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
