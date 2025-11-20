import { useState, useEffect } from 'react';
import { getSummary } from '../services/api';
import './Summary.css';

function Summary({ refreshTrigger }) {
  const [summary, setSummary] = useState({ total_income: 0, total_expenses: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await getSummary();
      setSummary(response.data);
    } catch (err) {
      console.error('Failed to load summary', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="summary loading">Loading summary...</div>;

  return (
    <div className="summary">
      <h2>Summary</h2>
      <div className="summary-cards">
        <div className="summary-card income">
          <h3>Total Income</h3>
          <p className="amount">+${parseFloat(summary.total_income || 0).toFixed(2)}</p>
        </div>
        <div className="summary-card expense">
          <h3>Total Expenses</h3>
          <p className="amount">-${parseFloat(summary.total_expenses || 0).toFixed(2)}</p>
        </div>
        <div className={`summary-card balance ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
          <h3>Balance</h3>
          <p className="amount">
            {summary.balance >= 0 ? '+' : ''}${parseFloat(summary.balance || 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Summary;