import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://gkbcxerxmpprjmvzyqar.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmN4ZXJ4bXBwcmptdnp5cWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjIwODAsImV4cCI6MjA3NzIzODA4MH0.5-xafZvulqLBAJ5bPS2s7qFCYUW-dPM82ilbsllmciE'
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
