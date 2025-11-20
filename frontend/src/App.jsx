import { useState } from 'react';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Summary from './components/Summary';
import './App.css';

function App() {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = () => {
    setEditingTransaction(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCancel = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="app">
      <header>
        <h1>💰 Budget Tracker</h1>
      </header>
      
      <main>
        <Summary refreshTrigger={refreshTrigger} />
        
        {editingTransaction ? (
          <TransactionForm
            transaction={editingTransaction}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <>
            <TransactionForm onSuccess={handleFormSuccess} />
            <TransactionList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;