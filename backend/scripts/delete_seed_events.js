import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tuczdhtpuannsqxcubtj.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Y3pkaHRwdWFubnNxeGN1YnRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM3MTU4OSwiZXhwIjoyMTAyOTQ3NTg5fQ.63Njpv0gavUw_NI3XEp5b8JlUlGeJnU3GDleF7Sr4DI';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function deleteSeedEvents() {
  console.log('Fetching events from Supabase...');
  const { data: events, error: fetchErr } = await supabaseAdmin.from('events').select('id, title');
  if (fetchErr) {
    console.error('Fetch error:', fetchErr.message);
    process.exit(1);
  }
  console.log('Current events in DB count:', events ? events.length : 0);

  // Delete all fake/seeded events from DB
  const { error } = await supabaseAdmin
    .from('events')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    console.error('Error deleting seed events:', error.message);
  } else {
    console.log('Successfully deleted fake seed events from Supabase DB.');
  }

  const { data: remaining } = await supabaseAdmin.from('events').select('id, title');
  console.log('Remaining events in DB count:', remaining ? remaining.length : 0);
  process.exit(0);
}

deleteSeedEvents();
