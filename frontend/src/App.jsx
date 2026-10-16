import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { LayoutDashboard, ReceiptText, Target, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import TransactionForm from './components/TransactionForm';
import ConfirmDialog from './components/ConfirmDialog';
import BudgetModal from './components/BudgetModal';
import AuthModal from './components/AuthModal';
import GoalModal from './components/GoalModal';
import AddFundsModal from './components/AddFundsModal';
import TargetWinnerModal from './components/TargetWinnerModal';
import BadgesModal from './components/BadgesModal';
import GoalsSection from './components/GoalsSection';
import WhatIfSimulatorModal from './components/WhatIfSimulatorModal';

import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AuthPage from './pages/AuthPage';

import {
  getTransactions,
  getMonthlySummary,
  getBudget,
  deleteTransaction,
  getGoals,
  deleteGoal,
  getMe
} from './services/api';
import { getCurrentMonthString } from './utils/formatters';

import './styles/index.css';
import './styles/layout.css';
import './styles/dashboard.css';
import './styles/transactions.css';
import './styles/components.css';

function App() {
  // Navigation State: 'dashboard' | 'transactions' | 'goals'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Month State (Default to current month, e.g. 2026-10)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString());

  // User Authentication State
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('spendsmart_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Data States
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    month: selectedMonth,
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
    categoryBreakdown: []
  });
  const [budget, setBudget] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('spendsmart_theme') || 'light';
  });

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formDefaultType, setFormDefaultType] = useState('expense');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Auth, Goals & Gamification Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState(null);

  // Celebration Winner Modal State
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [winningGoal, setWinningGoal] = useState(null);
  const [unlockedBadge, setUnlockedBadge] = useState(null);

  // What-If Simulator Modal State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('spendsmart_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Fetch Goals
  const fetchGoalsData = useCallback(async () => {
    try {
      const res = await getGoals();
      if (res && res.data) {
        setGoals(res.data);
      }
    } catch (err) {
      console.warn('Goals fetch note:', err.message);
    }
  }, []);

  // Fetch all dashboard data for selected month
  const fetchMonthData = useCallback(async (monthToFetch) => {
    setLoading(true);
    try {
      const [txRes, sumRes, budRes] = await Promise.all([
        getTransactions({ month: monthToFetch }),
        getMonthlySummary(monthToFetch),
        getBudget(monthToFetch).catch(() => ({ data: null }))
      ]);

      if (txRes && txRes.data) {
        setTransactions(txRes.data);
      }
      if (sumRes && sumRes.data) {
        setSummary(sumRes.data);
      }
      setBudget(budRes?.data || null);
    } catch (err) {
      console.error('Error fetching month data:', err);
      toast.error(err.message || 'Could not load data for this month');
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify auth token and sync user on mount
  useEffect(() => {
    const token = localStorage.getItem('spendsmart_token');
    if (token) {
      getMe()
        .then((res) => {
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('spendsmart_user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          localStorage.removeItem('spendsmart_token');
          localStorage.removeItem('spendsmart_user');
          setUser(null);
        });
    }
    fetchGoalsData();
  }, [fetchGoalsData]);

  // Effect: Refetch whenever selectedMonth changes
  useEffect(() => {
    fetchMonthData(selectedMonth);
  }, [selectedMonth, fetchMonthData]);

  // Handle Log Out
  const handleLogout = () => {
    localStorage.removeItem('spendsmart_token');
    localStorage.removeItem('spendsmart_user');
    setUser(null);
    toast.success('Logged out successfully. See you soon! 🌸');
    fetchMonthData(selectedMonth);
    fetchGoalsData();
  };

  // Handle Auth Success
  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    fetchMonthData(selectedMonth);
    fetchGoalsData();
  };

  // Open Add Transaction Modal
  const handleOpenAddModal = (type = 'expense') => {
    setEditingTransaction(null);
    setFormDefaultType(type);
    setIsFormModalOpen(true);
  };

  // Open Edit Transaction Modal
  const handleOpenEditModal = (tx) => {
    setEditingTransaction(tx);
    setFormDefaultType(tx.type);
    setIsFormModalOpen(true);
  };

  // Open Delete Confirmation Dialog
  const handleOpenDeleteDialog = (tx) => {
    setDeletingTransaction(tx);
    setIsConfirmOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deletingTransaction._id);
      toast.success('🌸 Transaction deleted successfully');
      setIsConfirmOpen(false);
      setDeletingTransaction(null);
      fetchMonthData(selectedMonth);
    } catch (err) {
      toast.error(err.message || 'Failed to delete transaction');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Form Success (Add or Edit)
  const handleFormSuccess = () => {
    fetchMonthData(selectedMonth);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#8E7CC3', '#FFB6C1', '#81C784', '#FFD54F']
    });
  };

  // Goals Handlers
  const handleOpenAddGoal = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleOpenDeposit = (goal) => {
    setSelectedGoalForDeposit(goal);
    setIsAddFundsModalOpen(true);
  };

  const handleDeleteGoal = async (goal) => {
    if (!window.confirm(`Are you sure you want to remove target "${goal.title}"?`)) return;
    try {
      await deleteGoal(goal._id);
      toast.success('Target removed');
      fetchGoalsData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete goal');
    }
  };

  // Target Win Celebration Handler
  const handleTargetReached = (completedGoal, badge) => {
    setWinningGoal(completedGoal);
    setUnlockedBadge(badge || null);
    setIsWinnerModalOpen(true);
    fetchGoalsData();
  };

  const completedGoalsCount = goals.filter((g) => g.isCompleted).length;

  // Gate the application behind the AuthPage when not logged in
  if (!user) {
    return (
      <div className="auth-root-wrapper">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '16px',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: '0.88rem'
            }
          }}
        />
        <AuthPage
          onAuthSuccess={handleAuthSuccess}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            fontFamily: 'inherit',
            fontWeight: 600,
            fontSize: '0.88rem'
          }
        }}
      />

      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        completedGoalsCount={completedGoalsCount}
        onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
        onOpenSimulatorModal={() => setIsSimulatorOpen(true)}
      />

      {/* Main Content Wrapper */}
      <div className="main-wrapper">
        {/* Topbar */}
        <Topbar
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onOpenAddModal={handleOpenAddModal}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
          onOpenSimulatorModal={() => setIsSimulatorOpen(true)}
          onOpenGoalsTab={() => setActiveTab('goals')}
          user={user}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Page Views */}
        <main className="page-content">
          {activeTab === 'dashboard' && (
            <Dashboard
              summary={summary}
              transactions={transactions}
              budget={budget}
              goals={goals}
              onOpenAddModal={handleOpenAddModal}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              onOpenAddGoal={handleOpenAddGoal}
              onOpenDeposit={handleOpenDeposit}
              onViewAllGoals={() => setActiveTab('goals')}
              onViewAllTransactions={() => setActiveTab('transactions')}
              onOpenSimulatorModal={() => setIsSimulatorOpen(true)}
              loading={loading}
            />
          )}

          {activeTab === 'transactions' && (
            <Transactions
              transactions={transactions}
              selectedMonth={selectedMonth}
              onOpenAddModal={handleOpenAddModal}
              onEditTransaction={handleOpenEditModal}
              onDeleteTransaction={handleOpenDeleteDialog}
              loading={loading}
            />
          )}

          {activeTab === 'goals' && (
            <div className="goals-page-wrapper">
              <GoalsSection
                goals={goals}
                onOpenAddGoal={handleOpenAddGoal}
                onOpenEditGoal={handleOpenEditGoal}
                onOpenDeposit={handleOpenDeposit}
                onDeleteGoal={handleDeleteGoal}
                onReplayWinCelebration={(goal) => handleTargetReached(goal, null)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <button
          className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          <Target size={20} />
          <span>Targets</span>
        </button>

        <button
          className="mobile-nav-item"
          onClick={() => handleOpenAddModal('expense')}
          style={{
            background: 'var(--accent-lavender)',
            color: 'white',
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem',
            marginTop: '-12px',
            boxShadow: '0 4px 12px rgba(142, 124, 195, 0.4)'
          }}
          title="Add Transaction"
        >
          <Plus size={22} />
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <ReceiptText size={20} />
          <span>Transactions</span>
        </button>
      </nav>

      {/* Add / Edit Transaction Modal */}
      <TransactionForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={handleFormSuccess}
        editData={editingTransaction}
        defaultType={formDefaultType}
      />

      {/* Custom Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeletingTransaction(null);
        }}
        onConfirm={handleConfirmDelete}
        transaction={deletingTransaction}
        loading={isDeleting}
      />

      {/* Monthly Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        selectedMonth={selectedMonth}
        currentBudget={budget}
        onBudgetSaved={(savedBudget) => setBudget(savedBudget)}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Goal Target Creation / Edit Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSuccess={fetchGoalsData}
        editGoal={editingGoal}
      />

      {/* Add Funds / Deposit Modal */}
      <AddFundsModal
        isOpen={isAddFundsModalOpen}
        onClose={() => {
          setIsAddFundsModalOpen(false);
          setSelectedGoalForDeposit(null);
        }}
        goal={selectedGoalForDeposit}
        onSuccess={fetchGoalsData}
        onTargetReached={handleTargetReached}
      />

      {/* Target Winner Celebration Modal */}
      <TargetWinnerModal
        isOpen={isWinnerModalOpen}
        onClose={() => setIsWinnerModalOpen(false)}
        goal={winningGoal}
        badge={unlockedBadge}
      />

      {/* Badges / Trophy Room Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        user={user}
        goals={goals}
        summary={summary}
        budget={budget}
      />

      {/* What-If Money Simulator Modal */}
      <WhatIfSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        summary={summary}
        budget={budget}
        goals={goals}
      />
    </div>
  );
}

export default App;
