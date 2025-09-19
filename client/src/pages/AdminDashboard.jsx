import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import StatsCards from '../components/admin/StatsCards';
import ItemsTable from '../components/admin/ItemsTable';
import AddItemModal from '../components/admin/AddItemModal';
import CollectItemModal from '../components/admin/CollectItemModal';
import QRCodeGenerator from '../components/QRCodeGenerator';
import StatsChart from '../components/StatsChart';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchItems();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchItems = async (status = activeTab) => {
    try {
      setLoadingItems(true);
      const response = await axios.get(`/api/items?status=${status}&limit=50`);
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to fetch items');
    } finally {
      setLoadingItems(false);
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      const formData = new FormData();
      formData.append('description', itemData.description);
      formData.append('foundLocation', itemData.foundLocation);
      formData.append('collectionLocation', itemData.collectionLocation);
      formData.append('category', itemData.category);
      formData.append('tags', itemData.tags);
      formData.append('image', itemData.image);

      const response = await axios.post('/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Item added successfully!');
      setShowAddModal(false);
      fetchItems();
      fetchStats();
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const handleCollectItem = async (collectedBy) => {
    try {
      await axios.patch(`/api/items/${selectedItem._id}/collect`, {
        collectedBy
      });

      toast.success('Item marked as collected!');
      setShowCollectModal(false);
      setSelectedItem(null);
      fetchItems();
      fetchStats();
    } catch (error) {
      console.error('Error collecting item:', error);
      toast.error('Failed to mark item as collected');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/items/${itemId}`);
        toast.success('Item deleted successfully!');
        fetchItems();
        fetchStats();
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchItems(tab);
  };

  const openCollectModal = (item) => {
    setSelectedItem(item);
    setShowCollectModal(true);
  };

  const openQRModal = (item) => {
    setSelectedItem(item);
    setShowQRModal(true);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1">
                <i className="bi bi-gear me-2"></i>
                Admin Dashboard
              </h1>
              <p className="text-muted mb-0">
                Welcome back, {user.username}! Manage lost and found items.
              </p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-info"
                onClick={() => setShowAnalytics(!showAnalytics)}
              >
                <i className={`bi bi-${showAnalytics ? 'eye-slash' : 'graph-up'} me-2`}></i>
                {showAnalytics ? 'Hide' : 'Show'} Analytics
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Item
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats.overview} index={0} />}

      {/* Analytics Section */}
      {showAnalytics && stats && (
        <div className="row mb-4 item-card-animation">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-graph-up me-2"></i>
                  Analytics Dashboard
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <h6 className="mb-3">Monthly Trends</h6>
                    <StatsChart data={stats.monthlyData} type="bar" />
                  </div>
                  <div className="col-md-4">
                    <h6 className="mb-3">Category Distribution</h6>
                    <StatsChart data={stats.categoryStats} type="pie" />
                  </div>
                </div>
                
                {stats.recentActivity && stats.recentActivity.length > 0 && (
                  <div className="mt-4">
                    <h6 className="mb-3">Recent Activity</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentActivity.slice(0, 5).map((item, index) => (
                            <tr key={index}>
                              <td className="text-truncate" style={{maxWidth: '200px'}}>
                                {item.description}
                              </td>
                              <td>
                                <span className={`badge bg-${item.status === 'active' ? 'warning' : 
                                  item.status === 'collected' ? 'success' : 'secondary'}`}>
                                  {item.status}
                                </span>
                              </td>
                              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                              <td>{item.uploadedBy?.username || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Items Management */}
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => handleTabChange('active')}
              >
                <i className="bi bi-clock me-1"></i>
                Active Items ({stats?.overview?.activeItems || 0})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'collected' ? 'active' : ''}`}
                onClick={() => handleTabChange('collected')}
              >
                <i className="bi bi-check-circle me-1"></i>
                Collected ({stats?.overview?.collectedItems || 0})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'archived' ? 'active' : ''}`}
                onClick={() => handleTabChange('archived')}
              >
                <i className="bi bi-archive me-1"></i>
                Archived ({stats?.overview?.archivedItems || 0})
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body p-0">
          <ItemsTable
            items={items}
            loading={loadingItems}
            activeTab={activeTab}
            onCollect={openCollectModal}
            onDelete={handleDeleteItem}
            onQR={openQRModal}
          />
        </div>
      </div>

      {/* Modals */}
      <AddItemModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />

      <CollectItemModal
        show={showCollectModal}
        onHide={() => {
          setShowCollectModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onCollect={handleCollectItem}
      />

      <QRCodeGenerator
        show={showQRModal}
        onHide={() => {
          setShowQRModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />
    </div>
  );
};

export default AdminDashboard;
