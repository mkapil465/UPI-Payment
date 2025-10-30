/*
  # Create UPI Payment Gateway Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique user identifier
      - `email` (text, unique) - User email for login
      - `password` (text) - User password (hashed in production)
      - `full_name` (text) - User's full name
      - `upi_id` (text, unique) - User's primary UPI ID
      - `created_at` (timestamptz) - Account creation timestamp
    
    - `transactions`
      - `id` (uuid, primary key) - Unique transaction identifier
      - `user_id` (uuid, foreign key) - ID of user initiating transaction
      - `recipient_upi_id` (text) - Recipient's UPI ID
      - `amount` (decimal) - Transaction amount
      - `notes` (text) - Optional transaction notes
      - `status` (text) - Transaction status (Success/Failed/Pending)
      - `created_at` (timestamptz) - Transaction timestamp

  2. Security
    - Enable RLS on both tables
    - Users can only read their own user data
    - Users can only view and create their own transactions
    - All operations require authentication

  3. Important Notes
    - Password storage is simplified for demo purposes
    - In production, passwords should be hashed using bcrypt or similar
    - Transaction status includes: 'Success', 'Failed', 'Pending'
    - Amount is stored as decimal for precise financial calculations
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  full_name text NOT NULL,
  upi_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_upi_id text NOT NULL,
  amount decimal(10, 2) NOT NULL CHECK (amount > 0),
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'Success',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for transactions table
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can insert their own transactions"
ON public.transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);


CREATE POLICY "Users can create own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_upi_id ON users(upi_id);

-- Insert sample users for testing
INSERT INTO users (email, password, full_name, upi_id) VALUES
  ('user1@example.com', 'password123', 'User 1', 'user1@paytm'),
  ('user2@example.com', 'password123', 'User 2', 'user2@phonepe'),
  ('user3@example.com', 'password123', 'User 3', 'user3@gpay')
ON CONFLICT (email) DO NOTHING;