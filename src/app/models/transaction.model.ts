export interface Transaction {
  id: string;
  user_id: string;
  recipient_upi_id: string;
  amount: number;
  notes: string;
  status: 'Success' | 'Failed' | 'Pending';
  created_at: string;
}
