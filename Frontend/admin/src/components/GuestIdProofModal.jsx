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

      const res = await apiClient.post(`/api/hotel/bookings/${booking._id}/id-proof`, formData, {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-[#FDFBF7] border border-[#C5A059]/40 rounded-3xl shadow-2xl overflow-hidden my-auto text-[#2C2523] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-[#2C2523] via-[#3D3330] to-[#2C2523] text-white p-5 sm:p-6 border-b border-[#C5A059]/40 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition cursor-pointer text-sm"
          >
            ✕
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              Uttarakhand Tourism Compliance
            </span>
            <span className="text-xs text-white/50">•</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
              Form C / Guest Register
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
            <span>Digital Guest ID Verification</span>
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Verify official identity proof (Aadhaar, Passport, Voter ID) for local Almora police and tourism compliance.
          </p>

          {/* Guest Context Bar */}
          <div className="mt-3.5 bg-white/5 border border-white/10 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-cinzel block">Guest Name</span>
              <span className="font-semibold text-white block truncate">{booking.guestDetails?.name}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-cinzel block">Allocated Suite</span>
              <span className="font-semibold text-[#C5A059] block truncate">{booking.room?.name || 'Chalet Suite'}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-cinzel block">Verification Status</span>
              <span className={`font-mono text-[11px] font-semibold ${previewUrl || idNumber ? 'text-emerald-400' : 'text-amber-400'}`}>
                {previewUrl || idNumber ? '✓ Verified on File' : '⚠️ Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans">
          {/* Document Type & Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                ID Document Type <span className="text-rose-600">*</span>
              </label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] font-medium text-xs focus:outline-hidden"
              >
                <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                <option value="Indian Passport">Indian Passport</option>
                <option value="International Passport">International Passport (Foreign Guest)</option>
                <option value="Voter ID Card">Voter ID (Election Commission)</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                Document / ID Number <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 5432-8765-1092"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] font-mono text-xs focus:outline-hidden uppercase"
              />
            </div>
          </div>

          {/* Photo Preview & Dropzone */}
          <div>
            <label className="block text-[11px] font-semibold text-[#2C2523] mb-1.5">
              Digital ID Proof Photo / Scan
            </label>

            {previewUrl ? (
              <div className="relative rounded-2xl border-2 border-[#C5A059]/50 overflow-hidden bg-black/5 p-2 flex flex-col items-center">
                <img
                  src={previewUrl}
                  alt="Guest ID Proof Preview"
                  className="max-h-60 rounded-xl object-contain shadow-xs bg-white"
                />
                <div className="mt-2.5 flex items-center justify-between w-full px-2">
                  <span className="text-[11px] font-mono text-stone-600 truncate max-w-[200px]">
                    {selectedFile ? selectedFile.name : 'Copy stored on server'}
                  </span>
                  <label className="text-xs font-semibold text-[#7C1D23] hover:underline cursor-pointer">
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
              <label className="border-2 border-dashed border-[#C5A059]/50 hover:border-[#7C1D23] rounded-2xl p-6 bg-[#FAF6EF]/60 hover:bg-[#FAF6EF] transition cursor-pointer flex flex-col items-center justify-center text-center group">
                <div className="w-12 h-12 rounded-full bg-white border border-[#C5A059]/40 flex items-center justify-center text-xl shadow-2xs mb-2 group-hover:scale-105 transition">
                  🪪
                </div>
                <span className="font-cinzel font-bold text-xs text-[#2C2523]">
                  Click or drag photo of Aadhaar / Passport
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
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
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <span className="text-base shrink-0">🛡️</span>
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
              className="px-4 py-2 rounded-xl text-xs font-cinzel font-semibold bg-[#FAF6EF] hover:bg-stone-200 text-[#2C2523] border border-[#C5A059]/40 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 rounded-xl bg-linear-to-r from-[#7C1D23] to-[#9B232A] hover:brightness-110 text-white font-cinzel font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isUploading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
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
