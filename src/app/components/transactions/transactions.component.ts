import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  isLoading = true;
  searchQuery = '';
  statusFilter = 'all';
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    await this.loadTransactions();
  }

  async loadTransactions(): Promise<void> {
    this.isLoading = true;
    this.transactions = await this.transactionService.getTransactions();
    this.filteredTransactions = [...this.transactions];
    this.isLoading = false;
  }

  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const matchesSearch = transaction.recipient_upi_id
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.statusFilter === 'all' ||
        transaction.status.toLowerCase() === this.statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    this.currentPage = 1;
  }

  sortByDate(ascending: boolean): void {
    this.filteredTransactions.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  sortByAmount(ascending: boolean): void {
    this.filteredTransactions.sort((a, b) => {
      return ascending ? a.amount - b.amount : b.amount - a.amount;
    });
  }

  get paginatedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredTransactions.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
