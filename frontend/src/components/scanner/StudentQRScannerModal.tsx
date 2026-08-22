import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  QrCode, X, CheckCircle2, AlertCircle, RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { recordStudentAttendance } from '@/services/registrationService';
import type { Event, Registration } from '@/types';

interface StudentQRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: Registration;
  event: Event;
  onAttendanceSuccess: () => void;
}

export function StudentQRScannerModal({
  isOpen,
  onClose,
  registration,
  event,
  onAttendanceSuccess,
}: StudentQRScannerModalProps) {
  const [scanning, setScanning] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = 'qr-reader-region';

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setResultMessage(null);
    setCameraError(null);
    setScanning(true);
    setProcessing(false);

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(regionId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            if (!isMounted || processing) return;

            // Pause scanner
            try {
              await html5QrCode.stop();
            } catch (e) {
              console.warn('Error stopping scanner:', e);
            }

            setScanning(false);
            setProcessing(true);

            // Record attendance
            const res = await recordStudentAttendance(
              registration.id,
              decodedText,
              event
            );

            setProcessing(false);

            if (res.success) {
              setResultMessage({
                type: 'success',
                text: res.message || `Attendance Confirmed for ${event.title}!`,
              });
              onAttendanceSuccess();
            } else {
              setResultMessage({
                type: 'error',
                text: res.error || 'Failed to verify QR code.',
              });
            }
          },
          () => {
            // Frame parse error (ignored while searching)
          }
        );
      } catch (err: any) {
        console.error('Camera init error:', err);
        if (isMounted) {
          setCameraError(
            err.message || 'Unable to access camera. Please allow camera permissions or use another device.'
          );
          setScanning(false);
        }
      }
    };

    // Small delay to ensure DOM element is rendered
    const timer = setTimeout(startScanner, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(console.error);
        }
        scannerRef.current.clear();
      }
    };
  }, [isOpen, registration.id, event]);

  const handleRetry = () => {
    setResultMessage(null);
    setCameraError(null);
    setScanning(true);
    setProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111C3A] border border-[#1E2D52] rounded-3xl max-w-md w-full p-6 shadow-2xl animate-slide-in relative flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Close Scanner"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
          <QrCode size={26} />
        </div>

        <h3 className="text-lg font-bold font-poppins text-white">
          Venue Check-In Scanner
        </h3>
        <p className="text-xs text-blue-300 font-semibold mt-0.5 line-clamp-1">
          {event.title}
        </p>
        <p className="text-[11px] text-slate-400 mt-1 mb-5">
          Scan the official QR Code displayed at the venue entrance to confirm your attendance.
        </p>

        {/* ─── Scanner Viewfinder ─── */}
        {scanning && (
          <div className="relative w-full max-w-[280px] h-[280px] bg-slate-950 rounded-2xl overflow-hidden border border-blue-500/40 shadow-inner flex items-center justify-center mb-5">
            <div id={regionId} className="w-full h-full object-cover" />

            {/* Viewfinder Target Box Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-blue-400/80 rounded-xl relative">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
                {/* Laser scan line */}
                <div className="w-full h-0.5 bg-blue-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse mt-20" />
              </div>
            </div>
          </div>
        )}

        {/* ─── Processing State ─── */}
        {processing && (
          <div className="py-12 flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-3 border-blue-500 border-t-transparent animate-spin" />
            <span className="text-xs font-semibold text-slate-300">
              Verifying QR & Event Date...
            </span>
          </div>
        )}

        {/* ─── Camera Error State ─── */}
        {cameraError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-5 text-center space-y-3">
            <AlertCircle size={32} className="text-red-400 mx-auto" />
            <p className="text-xs text-red-300 leading-relaxed">{cameraError}</p>
            <Button
              variant="secondary"
              size="sm"
              className="bg-[#0B1329] text-white border-[#1E2D52]"
              leftIcon={<RefreshCw size={14} />}
              onClick={handleRetry}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* ─── Result Message (Success or Error) ─── */}
        {resultMessage && (
          <div
            className={`w-full rounded-2xl p-5 mb-5 text-center space-y-3 border animate-slide-in ${
              resultMessage.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {resultMessage.type === 'success' ? (
              <CheckCircle2 size={36} className="text-green-400 mx-auto" />
            ) : (
              <AlertCircle size={36} className="text-red-400 mx-auto" />
            )}

            <div>
              <h4 className="text-sm font-bold text-white">
                {resultMessage.type === 'success' ? 'Attendance Recorded!' : 'Verification Error'}
              </h4>
              <p className="text-xs mt-1 leading-relaxed">{resultMessage.text}</p>
            </div>

            {resultMessage.type === 'success' ? (
              <Button
                variant="primary"
                size="md"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold shadow-lg"
                onClick={onClose}
              >
                Done
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="bg-[#0B1329] text-white border-[#1E2D52]"
                leftIcon={<RefreshCw size={14} />}
                onClick={handleRetry}
              >
                Scan Again
              </Button>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-[#0B1329] border border-[#1E2D52] rounded-xl p-3 text-left w-full text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <ShieldCheck size={13} className="text-blue-400" />
            <span>Attendance Requirements</span>
          </div>
          <p>• Only allowed on the official event date: <strong className="text-white">{new Date(event.event_start).toLocaleDateString()}</strong></p>
          <p>• Scanned QR must match the organizer's check-in pass for this event.</p>
        </div>
      </div>
    </div>
  );
}
