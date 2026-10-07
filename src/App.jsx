import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import NotificationBanner from './components/layout/NotificationBanner';
import SupplierFormModal from './components/supplier/SupplierFormModal';
import SupplierDetailModal from './components/supplier/SupplierDetailModal';

// Pages
import DashboardPage from './pages/DashboardPage';
import SuppliersPage from './pages/SuppliersPage';
import ComparePage from './pages/ComparePage';
import AIDecisionSupportPage from './pages/AIDecisionSupportPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import ExpertSystemPage from './pages/ExpertSystemPage';
import StatisticalReasoningPage from './pages/StatisticalReasoningPage';
import AIProblemSolverPage from './pages/AIProblemSolverPage';
import ReportsPage from './pages/ReportsPage';

function AppContent() {
  const { activeTab, inspectSupplier, setInspectSupplier } = useApp();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setIsFormModalOpen(true);
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onOpenAddSupplier={handleOpenAdd} />;
      case 'suppliers':
        return <SuppliersPage onOpenAdd={handleOpenAdd} onEditSupplier={handleEdit} />;
      case 'compare':
        return <ComparePage />;
      case 'ai-decision':
        return <AIDecisionSupportPage />;
      case 'knowledge-base':
        return <KnowledgeBasePage />;
      case 'expert-system':
        return <ExpertSystemPage />;
      case 'statistical':
        return <StatisticalReasoningPage />;
      case 'problem-solver':
        return <AIProblemSolverPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <DashboardPage onOpenAddSupplier={handleOpenAdd} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header Bar */}
        <Header />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderCurrentPage()}
          </div>
        </main>
      </div>

      {/* Add / Edit Supplier Modal */}
      <SupplierFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={editingSupplier}
      />

      {/* Supplier Profile Detail Modal */}
      <SupplierDetailModal
        supplier={inspectSupplier}
        isOpen={!!inspectSupplier}
        onClose={() => setInspectSupplier(null)}
      />

      {/* Global Notifications */}
      <NotificationBanner />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
