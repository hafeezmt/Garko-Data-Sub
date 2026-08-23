import React, { useEffect, useState } from 'react';
import { getDataPrices, updateDataPrice, createDataPrice, deleteDataPrice } from '../../lib/supabase';
import { Tag, Plus, Edit2, Trash2, CheckCircle2, XCircle, Loader2, Save, X, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPricing() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState('all');

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    network: 'mtn',
    plan_name: '',
    vtpass_variation_code: '',
    vtpass_price: '',
    selling_price: '',
    is_active: true
  });

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const data = await getDataPrices();
      setPrices(data);
    } catch (err) {
      console.error('Error loading data prices:', err);
      toast.error('Failed to load data prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      network: 'mtn',
      plan_name: '',
      vtpass_variation_code: '',
      vtpass_price: '',
      selling_price: '',
      is_active: true
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      network: item.network,
      plan_name: item.plan_name,
      vtpass_variation_code: item.vtpass_variation_code,
      vtpass_price: item.vtpass_price,
      selling_price: item.selling_price,
      is_active: item.is_active !== false
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.plan_name || !formData.vtpass_variation_code || !formData.vtpass_price || !formData.selling_price) {
      toast.error('Please fill in all required pricing fields');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        network: formData.network,
        plan_name: formData.plan_name,
        vtpass_variation_code: formData.vtpass_variation_code,
        vtpass_price: parseFloat(formData.vtpass_price),
        selling_price: parseFloat(formData.selling_price),
        is_active: formData.is_active
      };

      if (editingItem) {
        await updateDataPrice(editingItem.id, payload);
        toast.success('Data plan pricing updated!');
      } else {
        await createDataPrice(payload);
        toast.success('New data plan price created!');
      }

      setModalOpen(false);
      fetchPrices();
    } catch (err) {
      console.error('Save price error:', err);
      toast.error(err.message || 'Failed to save data price');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, planName) => {
    if (!window.confirm(`Are you sure you want to delete "${planName}"?`)) return;
    try {
      await deleteDataPrice(id);
      toast.success('Data plan deleted');
      fetchPrices();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.message || 'Failed to delete plan');
    }
  };

  const filteredPrices = prices.filter(p =>
    selectedNetwork === 'all' || (p.network || '').toLowerCase() === selectedNetwork.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-brand-accent" /> Pricing Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure custom selling prices for data bundles and set your profit markups.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-brand-dark text-xs font-extrabold shadow-md flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Bundle Price</span>
        </button>
      </div>

      {/* Network Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'mtn', 'airtel', 'glo', '9mobile'].map((net) => (
          <button
            key={net}
            onClick={() => setSelectedNetwork(net)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              selectedNetwork === net
                ? 'bg-brand-dark text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {net === 'all' ? 'All Networks' : net}
          </button>
        ))}
      </div>

      {/* Pricing Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-6">Network & Plan</th>
                <th className="py-3.5 px-4">VTPass Code</th>
                <th className="py-3.5 px-4 text-right">VTPass Cost</th>
                <th className="py-3.5 px-4 text-right">Selling Price</th>
                <th className="py-3.5 px-4 text-right">Profit Markup</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPrices.length > 0 ? (
                filteredPrices.map((item) => {
                  const cost = parseFloat(item.vtpass_price || 0);
                  const sell = parseFloat(item.selling_price || 0);
                  const markup = sell - cost;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-700 mr-2">
                          {item.network}
                        </span>
                        <span className="font-bold text-slate-900">{item.plan_name}</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-slate-500">
                        {item.vtpass_variation_code}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-medium text-slate-500">
                        ₦{cost.toLocaleString('en-NG')}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-black text-slate-900">
                        ₦{sell.toLocaleString('en-NG')}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className={`font-bold text-xs ${markup >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          +₦{markup.toLocaleString('en-NG')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {item.is_active !== false ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                            <XCircle className="w-3.5 h-3.5" /> Disabled
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-6 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-brand-dark hover:bg-slate-100 transition-colors"
                            title="Edit Pricing"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.plan_name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No data plan pricing records found. Click "Add New Bundle Price" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Pricing Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-4">
              {editingItem ? 'Edit Data Plan Pricing' : 'Add New Data Plan'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Network */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Network
                </label>
                <select
                  value={formData.network}
                  onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                >
                  <option value="mtn">MTN</option>
                  <option value="airtel">Airtel</option>
                  <option value="glo">Glo</option>
                  <option value="9mobile">9mobile</option>
                </select>
              </div>

              {/* Plan Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Plan Display Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.plan_name}
                  onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                  placeholder="e.g. MTN 1GB SME (30 Days)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                />
              </div>

              {/* VTPass Variation Code */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  VTPass Variation Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.vtpass_variation_code}
                  onChange={(e) => setFormData({ ...formData, vtpass_variation_code: e.target.value })}
                  placeholder="e.g. mtn-1gb-sme"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900"
                />
              </div>

              {/* Prices Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    VTPass Cost (₦)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.vtpass_price}
                    onChange={(e) => setFormData({ ...formData, vtpass_price: e.target.value })}
                    placeholder="270"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Selling Price (₦)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                    placeholder="290"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Active Switch */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-brand-accent rounded border-slate-300 focus:ring-brand-accent"
                />
                <label htmlFor="is_active" className="text-xs font-bold text-slate-700">
                  Active (Visible to customers)
                </label>
              </div>

              {/* CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3.5 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Price...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Pricing</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
