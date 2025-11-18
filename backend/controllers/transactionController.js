import {
    getAllTransactionsFromDB,
    getTransactionByIdFromDB,
    createTransactionInDB,
    updateTransactionInDB,
    deleteTransactionFromDB,
    getTransactionsSummaryFromDB
  } from '../models/transaction.js';
  
  export const getAllTransactions = async (req, res) => {
    try {
      const transactions = await getAllTransactionsFromDB();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getTransactionById = async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await getTransactionByIdFromDB(id);
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const createTransaction = async (req, res) => {
    try {
      const { description, amount, type, category_id, date } = req.body;
      
      if (!description || !amount || !type || !date) {
        return res.status(400).json({ 
          error: 'Missing required fields: description, amount, type, date' 
        });
      }
  
      if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ 
          error: 'Type must be either "income" or "expense"' 
        });
      }
  
      const transaction = await createTransactionInDB({
        description,
        amount: parseFloat(amount),
        type,
        category: category_id || null,
        date
      });
      
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const updateTransaction = async (req, res) => {
    try {
      const { id } = req.params;
      const { description, amount, type, category_id, date } = req.body;
      
      const transaction = await updateTransactionInDB(id, {
        description,
        amount: amount ? parseFloat(amount) : undefined,
        type,
        category_id,
        date
      });
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const deleteTransaction = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await deleteTransactionFromDB(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getTransactionsSummary = async (req, res) => {
    try {
      const summary = await getTransactionsSummaryFromDB();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };