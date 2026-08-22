import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://tuczdhtpuannsqxcubtj.supabase.co';
const anonKey = process.env.SUPABASE_ANON_KEY;

const client = createClient(supabaseUrl, anonKey);

const accounts = [
  { email: 'admin@ksrce.ac.in', password: 'Campus@123' },
  { email: 'organizer@ksrce.ac.in', password: 'Campus@123' },
  { email: 'acm.lead@ksrce.ac.in', password: 'Campus@123' },
  { email: 'student@ksrce.ac.in', password: 'Campus@123' },
];

async function testAll() {
  console.log('Testing authentication for all accounts...\n');

  for (const acc of accounts) {
    const { data, error } = await client.auth.signInWithPassword({
      email: acc.email,
      password: acc.password,
    });

    if (error) {
      console.log(`❌ FAILED: ${acc.email} -> ${error.message}`);
    } else {
      console.log(`✅ SUCCESS: ${acc.email} logged in! User ID: ${data.user.id}`);
      await client.auth.signOut();
    }
  }
}

testAll();
