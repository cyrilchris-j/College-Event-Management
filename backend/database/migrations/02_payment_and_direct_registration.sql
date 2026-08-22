-- ====================================================================
-- CampusConnect Database Schema Migration 02
-- Feature: Direct Registration, GPay/UPI Payments & Proof Storage
-- ====================================================================

-- 1. ADD PAYMENT COLUMNS TO EVENTS TABLE
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS entry_fee NUMERIC NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS gpay_number TEXT DEFAULT '9876543210',
ADD COLUMN IF NOT EXISTS gpay_upi_id TEXT DEFAULT 'campusconnect@upi';

-- 2. ADD PAYMENT PROOF COLUMNS TO REGISTRATIONS TABLE
ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS payment_mode TEXT NOT NULL DEFAULT 'free' CHECK (payment_mode IN ('free', 'gpay_upi', 'cash')),
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'free' CHECK (payment_status IN ('free', 'pending_verification', 'verified', 'rejected'));

-- 3. CREATE STORAGE BUCKET FOR PAYMENT PROOFS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. STORAGE RLS POLICIES FOR PAYMENT PROOFS
DROP POLICY IF EXISTS "Public Read Payment Proofs" ON storage.objects;
CREATE POLICY "Public Read Payment Proofs" ON storage.objects 
    FOR SELECT TO public USING (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "Allow All Upload Payment Proofs" ON storage.objects;
CREATE POLICY "Allow All Upload Payment Proofs" ON storage.objects 
    FOR INSERT TO public WITH CHECK (bucket_id = 'payment-proofs');

-- 5. UPDATE SAMPLE DEMO EVENTS WITH PAYMENT DETAILS
UPDATE public.events 
SET 
  entry_fee = 150,
  is_paid = true,
  gpay_number = '9876543210',
  gpay_upi_id = 'ksrce.acm@upi'
WHERE title ILIKE '%Autonomous AI%' OR title ILIKE '%HackCampus%';

UPDATE public.events 
SET 
  entry_fee = 0,
  is_paid = false
WHERE title ILIKE '%Rhapsody%';
