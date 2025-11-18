import pool from '../config/database.js';

export const getAllTransactionsFromDB = async () => {
  const result = await pool.query(
    'SELECT * FROM transactions ORDER BY date DESC, id DESC'
  );
  return result.rows;
};

export const getTransactionByIdFromDB = async (id) => {
  const result = await pool.query(
    'SELECT * FROM transactions WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const createTransactionInDB = async ({ description, amount, type, category_id, date }) => {
  const result = await pool.query(
    `INSERT INTO transactions (description, amount, type, category_id, date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [description, amount, type, category_id || null, date]
  );
  return result.rows[0];
};

export const updateTransactionInDB = async (id, { description, amount, type, category_id, date }) => {
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (description !== undefined) {
    updates.push(`description = $${paramCount++}`);
    values.push(description);
  }
  if (amount !== undefined) {
    updates.push(`amount = $${paramCount++}`);
    values.push(amount);
  }
  if (type !== undefined) {
    updates.push(`type = $${paramCount++}`);
    values.push(type);
  }
  if (category_id !== undefined) {
    updates.push(`category_id = $${paramCount++}`);
    values.push(category_id);
  }
  if (date !== undefined) {
    updates.push(`date = $${paramCount++}`);
    values.push(date);
  }

  if (updates.length === 0) {
    return await getTransactionByIdFromDB(id);
  }

  values.push(id);
  const result = await pool.query(
    `UPDATE transactions 
     SET ${updates.join(', ')}
     WHERE id = $${paramCount}
     RETURNING *`,
    values
  );
  return result.rows[0];
};

export const deleteTransactionFromDB = async (id) => {
  const result = await pool.query(
    'DELETE FROM transactions WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

export const getTransactionsSummaryFromDB = async () => {
  const result = await pool.query(`
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
    FROM transactions
  `);
  return result.rows[0];
};