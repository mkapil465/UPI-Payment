# UPI Gateway (WowPe) - Angular Frontend

This is a minimal Angular frontend implementing a mock UPI payment flow and transaction history.

## Project name
upi-gateway

## Features
- Mock Login (via In-Memory API)
- UPI ID input + validation
- Send Money (mock, creates a transaction)
- Transaction History with search, date filter, sorting and pagination
- Bootstrap-based responsive UI

## Requirements
- Node.js (16+ recommended)
- Angular CLI (for `ng serve`) — optional if using IDE or StackBlitz
- uses supabase database

## Setup
```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
ng serve

# Then open http://localhost:4200
