import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { LeadsTable } from './components/LeadsTable';
import { AddLeadModal } from './components/AddLeadModal';

const initialLeads = [
  {
    id: '1',
    name: 'Vamsi Krishna',
    phone: '(784) 415-9221',
    email: 'vkk@gmail.com',
    address: 'North Bethesda, Maryland, 23323',
    type: 'Seller' as const
  },
  {
    id: '2',
    name: 'John Test',
    phone: '(994) 871-5084',
    email: 'smaloth@ptcg.in',
    address: '7776',
    type: 'Buyer' as const
  },
  {
    id: '3',
    name: 'Shelly Null',
    phone: '(203) 241-9545',
    email: 'sgrumbo@gmail.com',
    address: '8 Dolan Ave, Matawan, NJ, 07747',
    type: 'Seller' as const
  },
  {
    id: '4',
    name: 'Alyce Molinari',
    phone: '(973) 723-4211',
    email: 'ALYCE.MOLINARI@PR...',
    address: 'Caldwell, NJ, 07006',
    type: 'Buyer' as const
  },
  {
    id: '5',
    name: 'Sylvia Simpson',
    phone: '(732) 547-0016',
    email: 'sylviasimp18@yahoo.com',
    address: 'NJ',
    type: 'Buyer' as const
  },
  {
    id: '6',
    name: 'Olivia Mogavero',
    phone: '(914) 589-3683',
    email: 'omogavero@gmail.com',
    address: 'Greenlawn, NY, 11740',
    type: 'Buyer' as const
  },
  {
    id: '7',
    name: 'Cheryl Mchugh',
    phone: '(908) 910-8090',
    email: 'cherylmchugh@verizon...',
    address: 'Manasquan, NJ, 08736',
    type: 'Buyer' as const
  },
  {
    id: '8',
    name: 'Delphine Steward',
    phone: '(732) 642-7904',
    email: 'stewards5752@yahoo.c...',
    address: 'Asbury Park, NJ, 07712',
    type: 'Buyer' as const
  },
  {
    id: '9',
    name: 'Shirley Hill',
    phone: '(908) 872-6004',
    email: 'raineyhill@comcast.net',
    address: '272 Mountain Ave, New Providence...',
    type: 'Seller' as const
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState(initialLeads);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddLead = (newLead: any) => {
    setLeads([...leads, newLead]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h3>
              <p className="text-gray-600">Comprehensive analytics and insights coming soon...</p>
            </div>
          </div>
        );
      case 'leads':
        return (
          <LeadsTable
            leads={leads}
            searchQuery={searchQuery}
            onAddLead={() => setIsAddModalOpen(true)}
          />
        );
      case 'appointments':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Appointment Management</h3>
              <p className="text-gray-600">Schedule and manage client appointments...</p>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Team Management</h3>
              <p className="text-gray-600">Manage your real estate team members...</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Reports</h3>
              <p className="text-gray-600">Detailed performance analytics and insights...</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Custom Reports</h3>
              <p className="text-gray-600">Generate custom reports and exports...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto">
        {renderContent()}
      </main>
      
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLead={handleAddLead}
      />
    </div>
  );
}

export default App;