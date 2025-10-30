import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Transaction } from '../models/transaction.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  async createTransaction(
    recipientUpiId: string,
    amount: number,
    notes: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'User not authenticated.' };
      }

      const { error } = await this.supabaseService.getClient()
        .from('transactions')
        .insert({
          user_id: currentUser.id,
          recipient_upi_id: recipientUpiId,
          amount: amount,
          notes: notes,
          status: 'Success'
        });

      if (error) {
        return { success: false, error: 'Failed to create transaction.' };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return [];
      }

      const { data, error } = await this.supabaseService.getClient()
        .from('transactions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error || !data) {
        return [];
      }

      return data as Transaction[];
    } catch (err) {
      return [];
    }
  }

  validateUpiId(upiId: string): boolean {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(upiId);
  }
}
