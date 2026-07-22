import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key) {
        envVars[key.trim()] = rest.join('=').trim();
    }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log("Checking if 'orders' table exists...");
    const { data, error } = await supabase.from('orders').select('*').limit(1);
    if (error) {
        console.error("Error/Table might not exist:", error);
    } else {
        console.log("Success! 'orders' table exists. Data:", data);
    }
}
test();
