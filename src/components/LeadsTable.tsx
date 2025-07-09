import React, { useState } from 'react';
import { ChevronDown, Phone, Mail, MessageCircle, Filter, Plus, Settings } from 'lucide-react';
import { ColumnPreferencesModal } from './ColumnPreferencesModal';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  type: 'Buyer' | 'Seller';
}

interface LeadsTableProps {
  leads: Lead[];
  searchQuery: string;
  onAddLead: () => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, searchQuery, onAddLead }) => {
  const [sortColumn, setSortColumn] = useState<keyof Lead>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Buyer' | 'Seller'>('all');
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.phone.includes(searchQuery);
    const matchesType = typeFilter === 'all' || lead.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
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

  const ContactButton = ({ icon: Icon, onClick, className = "" }: { icon: any, onClick: () => void, className?: string }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${className}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">Leads</h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'Buyer' | 'Seller')}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="all">All Types</option>
              <option value="Buyer">Buyers</option>
              <option value="Seller">Sellers</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsColumnModalOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={onAddLead}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-6 py-3">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              </th>
              {[
                { key: 'name', label: 'Name' },
                { key: 'phone', label: 'Phone' },
                { key: 'email', label: 'E Mail' },
                { key: 'address', label: 'Address' },
                { key: 'type', label: 'Type' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(key as keyof Lead)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{lead.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{lead.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{lead.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{lead.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    lead.type === 'Buyer' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {lead.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <ContactButton
                      icon={Phone}
                      onClick={() => window.open(`tel:${lead.phone}`)}
                      className="text-blue-600 hover:bg-blue-50"
                    />
                    <ContactButton
                      icon={Mail}
                      onClick={() => window.open(`mailto:${lead.email}`)}
                      className="text-green-600 hover:bg-green-50"
                    />
                    <ContactButton
                      icon={MessageCircle}
                      onClick={() => window.open(`sms:${lead.phone}`)}
                      className="text-purple-600 hover:bg-purple-50"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ColumnPreferencesModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onSave={(columns) => {
          // Handle column preferences save
          console.log('Saved columns:', columns);
        }}
      />
    </div>
  );
};