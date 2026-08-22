import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://tuczdhtpuannsqxcubtj.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const supabaseClient = createClient(supabaseUrl, anonKey);

const usersToSeed = [
  {
    email: 'admin@ksrce.ac.in',
    password: 'Campus@123',
    role: 'admin',
    full_name: 'Campus Administrator',
  },
  {
    email: 'organizer@ksrce.ac.in',
    password: 'Campus@123',
    role: 'organizer',
    full_name: 'Faculty Event Organizer',
  },
  {
    email: 'acm.lead@ksrce.ac.in',
    password: 'Campus@123',
    role: 'organizer',
    full_name: 'ACM Student Chapter Lead',
  },
  {
    email: 'student@ksrce.ac.in',
    password: 'Campus@123',
    role: 'student',
    full_name: 'Alex Chen',
    roll_number: '2026CSE001',
    department: 'Computer Science and Engineering',
    year_of_study: 3,
  },
];

async function seed() {
  console.log('🌱 Starting user seeding using Supabase Admin Auth API...');

  for (const u of usersToSeed) {
    try {
      console.log(`\nProcessing: ${u.email} (Role: ${u.role})`);

      // 1. Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find(x => x.email === u.email);

      let userId;

      if (existing) {
        console.log(`  - User already exists (ID: ${existing.id}). Updating password & confirming email...`);
        userId = existing.id;
        const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: u.password,
          email_confirm: true,
          user_metadata: { role: u.role, full_name: u.full_name },
        });
        if (updateErr) console.error('  - Update error:', updateErr.message);
      } else {
        console.log(`  - Creating new user...`);
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: { role: u.role, full_name: u.full_name },
        });

        if (createErr) {
          console.error('  - Create error:', createErr.message);
          continue;
        }
        userId = created.user.id;
      }

      // 2. Ensure record in public.profiles
      const { error: profileErr } = await supabaseAdmin
        .from('profiles')
        .upsert(
          {
            id: userId,
            email: u.email,
            role: u.role,
            student_id: u.role === 'student' ? (u.roll_number || 'CCS-2026-10492') : null,
          },
          { onConflict: 'id' }
        );

      if (profileErr) console.error('  - Profile upsert error:', profileErr.message);
      else console.log('  - public.profiles updated successfully.');

      // 3. If student, ensure record in public.student_profiles
      if (u.role === 'student') {
        const { error: spErr } = await supabaseAdmin
          .from('student_profiles')
          .upsert(
            {
              user_id: userId,
              full_name: u.full_name,
              roll_number: u.roll_number,
              department: u.department,
              year_of_study: u.year_of_study,
              phone: '9876543210',
            },
            { onConflict: 'user_id' }
          );
        if (spErr) console.error('  - student_profiles error:', spErr.message);
        else console.log('  - public.student_profiles updated successfully.');
      }

      // 4. Test actual sign-in with anon client to guarantee login works!
      const { data: testLogin, error: loginErr } = await supabaseClient.auth.signInWithPassword({
        email: u.email,
        password: u.password,
      });

      if (loginErr) {
        console.error(`  ❌ Test login failed:`, loginErr.message);
      } else {
        console.log(`  ✅ Test login SUCCESSFUL! Access token generated for ${u.email}`);
        await supabaseClient.auth.signOut();
      }
    } catch (err) {
      console.error(`Error processing ${u.email}:`, err);
    }
  }

  console.log('\n✨ User seeding completed successfully!');
}

seed();
