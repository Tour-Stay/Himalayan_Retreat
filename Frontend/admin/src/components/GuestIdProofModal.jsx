import { useState } from 'react';
import { apiClient } from '@shared';
import { useToast } from './Toast';

export default function GuestIdProofModal({ booking, isOpen, onClose, onIdProofUpdated }) {
  const { addToast } = useToast();

  const [idType, setIdType] = useState(booking?.idProofType || 'Aadhaar Card');
  const [idNumber, setIdNumber] = useState(booking?.idProofNumber || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(booking?.idProofUrl || '');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen || !booking) return null;

  // Handle local image file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file (JPEG, PNG, WEBP).', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be under 5MB.', 'warning');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Submit ID proof to backend
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!idNumber.trim()) {
      addToast('Please provide the ID document number.', 'warning');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('idProofType', idType.trim());
      formData.append('idProofNumber', idNumber.trim());
      if (selectedFile) {
        formData.append('idProof', selectedFile);
      }

      const res = await apiClient.post(`/hotel/bookings/${booking._id}/id-proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      addToast('Digital Guest ID Proof verified & attached successfully!', 'success');
      if (onIdProofUpdated && res.data?.booking) {
        onIdProofUpdated(res.data.booking);
      }
      onClose();
    } catch (err) {
      console.error('ID proof upload error:', err);
      addToast(err.response?.data?.message || 'Failed to upload ID proof.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="w-full sm:max-w-xl bg-white border border-[#C5A059]/40 shadow-2xl overflow-hidden my-0 sm:my-auto text-[#0F172A] flex flex-col max-h-[95vh] sm:max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0B1118] text-white p-4 sm:p-5 border-b border-[#C5A059]/40 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 w-8 h-8 flex items-center justify-center transition cursor-pointer text-sm border border-white/10"
            title="Close"
          >
            ✕
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              Uttarakhand Tourism Compliance
            </span>
            <span className="text-xs text-white/50">•</span>
            <span className="text-[10px] font-mono text-[#D4AF37] bg-[#C5A059]/15 px-2 py-0.5 border border-[#C5A059]/30">
              Form C / Guest Register
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2">
            <span>Digital Guest ID Verification</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 pr-6 sm:pr-0">
            Verify official identity proof (Aadhaar, Passport, Voter ID) for local Almora police and tourism compliance.
          </p>

          {/* Guest Context Bar */}
          <div className="mt-3.5 bg-white/5 border border-white/10 p-2.5 sm:p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-cinzel block">Guest Name</span>
              <span className="font-semibold text-white block truncate">{booking.guestDetails?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-cinzel block">Allocated Suite</span>
              <span className="font-semibold text-[#D4AF37] block truncate">{booking.room?.name || 'Chalet Suite'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-cinzel block">Verification Status</span>
              <span className={`font-mono text-[11px] font-semibold ${previewUrl || idNumber ? 'text-emerald-400' : 'text-amber-400'}`}>
                {previewUrl || idNumber ? '✓ Verified on File' : '⚠ Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans flex-1">
          {/* Document Type & Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                ID Document Type <span className="text-rose-600">*</span>
              </label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] font-medium text-xs focus:outline-none focus:border-[#C5A059]"
              >
                <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                <option value="Indian Passport">Indian Passport</option>
                <option value="International Passport">International Passport (Foreign Guest)</option>
                <option value="Voter ID Card">Voter ID (Election Commission)</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                Document / ID Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 5432-8765-1092"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#C5A059] uppercase"
              />
            </div>
          </div>

          {/* Photo Preview & Dropzone */}
          <div>
            <label className="block text-[11px] font-semibold text-[#0F172A] mb-1.5">
              Digital ID Proof Photo / Scan
            </label>

            {previewUrl ? (
              <div className="relative border border-[#C5A059]/40 overflow-hidden bg-slate-50 p-2 flex flex-col items-center">
                <img
                  src={previewUrl}
                  alt="Guest ID Proof Preview"
                  className="max-h-56 object-contain shadow-2xs bg-white border border-slate-200"
                />
                <div className="mt-2.5 flex items-center justify-between w-full px-2">
                  <span className="text-[11px] font-mono text-slate-600 truncate max-w-[200px]">
                    {selectedFile ? selectedFile.name : 'Copy stored on server'}
                  </span>
                  <label className="text-xs font-semibold text-[#0B1118] hover:text-[#C5A059] hover:underline cursor-pointer">
                    Replace Photo ↺
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#C5A059]/40 hover:border-[#C5A059] p-5 sm:p-6 bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition cursor-pointer flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-white border border-[#C5A059]/40 flex items-center justify-center shadow-2xs mb-2 text-[#0B1118]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" /></svg>
                </div>
                <span className="font-cinzel font-bold text-xs text-[#0F172A]">
                  Click or drag photo of Aadhaar / Passport
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  JPEG, PNG, or WEBP up to 5MB. Front or back image.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Compliance Assurance Note */}
          <div className="p-3 bg-amber-50/70 border border-amber-300 text-[11px] text-amber-900 flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <div>
              <strong>Police & Tourism Compliance:</strong> In accordance with Uttarakhand Tourism & Police guidelines, all hotels and homestays at Kasar Devi / Almora must maintain verified guest identity documents. Data is encrypted and accessible only to authorized staff.
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-xs font-cinzel font-semibold bg-[#FAF8F5] hover:bg-slate-200 text-[#0F172A] border border-slate-300 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B1118] font-cinzel font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 border border-[#D4AF37]"
            >
              {isUploading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#0B1118]/30 border-t-[#0B1118] rounded-full animate-spin shrink-0" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>✓</span>
                  <span>Save & Verify ID</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
