import React, { useState } from 'react';
import { ChevronDown, Phone, Mail, MessageCircle, Filter, Plus, Settings, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { ColumnPreferencesModal } from './ColumnPreferencesModal';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  type: 'Buyer' | 'Seller' | 'Buyer/Seller';
  category?: string;
  agent?: string;
  source?: string;
  status?: string;
  secondarySource?: string;
  thirdSource?: string;
}

interface Column {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

interface LeadsTableProps {
  leads: Lead[];
  searchQuery: string;
  onAddLead: () => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, searchQuery, onAddLead }) => {
  const [sortColumn, setSortColumn] = useState<keyof Lead>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Buyer' | 'Seller' | 'Buyer/Seller'>('all');
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const [columns, setColumns] = useState<Column[]>([
    { id: 'name', label: 'Name', visible: true, order: 0 },
    { id: 'phone', label: 'Phone', visible: true, order: 1 },
    { id: 'email', label: 'E Mail', visible: true, order: 2 },
    { id: 'address', label: 'Address', visible: true, order: 3 },
    { id: 'type', label: 'Type', visible: true, order: 4 },
    { id: 'category', label: 'Category', visible: false, order: 5 },
    { id: 'agent', label: 'Agent', visible: false, order: 6 },
    { id: 'source', label: 'Source', visible: false, order: 7 },
    { id: 'status', label: 'Status', visible: false, order: 8 },
    { id: 'secondarySource', label: 'Secondary Source', visible: false, order: 9 },
    { id: 'thirdSource', label: 'Third Source', visible: false, order: 10 }
  ]);

  const visibleColumns = columns.filter(col => col.visible).sort((a, b) => a.order - b.order);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.phone.includes(searchQuery);
    const matchesType = typeFilter === 'all' || lead.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const aValue = a[sortColumn] || '';
    const bValue = b[sortColumn] || '';
    const direction = sortDirection === 'asc' ? 1 : -1;
    return aValue < bValue ? -direction : aValue > bValue ? direction : 0;
  });

  const handleSort = (column: keyof Lead) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === sortedLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(sortedLeads.map(lead => lead.id));
    }
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleColumnSave = (newColumns: Column[]) => {
    setColumns(newColumns);
  };

  const renderCellContent = (lead: Lead, columnId: string) => {
    switch (columnId) {
      case 'name':
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
              {lead.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{lead.name}</div>
              <div className="text-sm text-gray-500">Lead #{lead.id.padStart(3, '0')}</div>
            </div>
          </div>
        );
      case 'phone':
        return <div className="text-gray-900 font-medium">{lead.phone}</div>;
      case 'email':
        return <div className="text-gray-900">{lead.email}</div>;
      case 'address':
        return <div className="text-gray-900">{lead.address}</div>;
      case 'type':
        return (
          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
            lead.type === 'Buyer' 
              ? 'bg-green-100 text-green-800 border border-green-200'
              : lead.type === 'Seller'
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : 'bg-gradient-to-r from-green-100 to-blue-100 text-purple-800 border border-purple-200'
          }`}>
            {lead.type}
          </span>
        );
      case 'category':
        return <div className="text-gray-900">{lead.category || 'Residential'}</div>;
      case 'agent':
        return <div className="text-gray-900">{lead.agent || 'Unassigned'}</div>;
      case 'source':
        return <div className="text-gray-900">{lead.source || 'Website'}</div>;
      case 'status':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            {lead.status || 'New'}
          </span>
        );
      case 'secondarySource':
        return <div className="text-gray-900">{lead.secondarySource || '-'}</div>;
      case 'thirdSource':
        return <div className="text-gray-900">{lead.thirdSource || '-'}</div>;
      default:
        return null;
    }
  };

  const ContactButton = ({ icon: Icon, onClick, className = "", label }: { icon: any, onClick: () => void, className?: string, label: string }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${className}`}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: leads.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Buyers', value: leads.filter(l => l.type === 'Buyer' || l.type === 'Buyer/Seller').length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Sellers', value: leads.filter(l => l.type === 'Seller' || l.type === 'Buyer/Seller').length, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Buyer/Seller', value: leads.filter(l => l.type === 'Buyer/Seller').length, color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <div className={`w-6 h-6 ${stat.color.replace('text-', 'bg-')} rounded`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">Lead Management</h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | 'Buyer' | 'Seller' | 'Buyer/Seller')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                <option value="all">All Types</option>
                <option value="Buyer">Buyers Only</option>
                <option value="Seller">Sellers Only</option>
                <option value="Buyer/Seller">Buyer/Seller Only</option>
              </select>
            </div>
            {selectedLeads.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">
                  {selectedLeads.length} selected
                </span>
                <button className="text-red-600 hover:text-red-700 font-medium">Delete</button>
                <button className="text-indigo-600 hover:text-indigo-700 font-medium">Export</button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsColumnModalOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Column preferences"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onAddLead}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add Lead</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={selectedLeads.length === sortedLeads.length && sortedLeads.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                {visibleColumns.map(({ id, label }) => (
                  <th
                    key={id}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort(id as keyof Lead)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        sortColumn === id && sortDirection === 'desc' ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedLeads.map((lead) => (
                <tr key={lead.id} className={`hover:bg-gray-50 transition-colors ${
                  selectedLeads.includes(lead.id) ? 'bg-indigo-50' : ''
                }`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                    />
                  </td>
                  {visibleColumns.map(({ id }) => (
                    <td key={id} className="px-6 py-4 whitespace-nowrap">
                      {renderCellContent(lead, id)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <ContactButton
                        icon={Phone}
                        onClick={() => window.open(`tel:${lead.phone}`)}
                        className="text-blue-600 hover:bg-blue-50"
                        label="Call"
                      />
                      <ContactButton
                        icon={Mail}
                        onClick={() => window.open(`mailto:${lead.email}`)}
                        className="text-green-600 hover:bg-green-50"
                        label="Email"
                      />
                      <ContactButton
                        icon={MessageCircle}
                        onClick={() => window.open(`sms:${lead.phone}`)}
                        className="text-purple-600 hover:bg-purple-50"
                        label="Message"
                      />
                      <ContactButton
                        icon={Eye}
                        onClick={() => {}}
                        className="text-gray-600 hover:bg-gray-50"
                        label="View"
                      />
                      <div className="relative group">
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <div className="text-sm text-gray-600">
            Showing {sortedLeads.length} of {leads.length} leads
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded border border-gray-300 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded border border-indigo-600">
              1
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded border border-gray-300 transition-colors">
              2
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded border border-gray-300 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
      
      <ColumnPreferencesModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onSave={handleColumnSave}
        initialColumns={columns}
      />
    </div>
  );
};