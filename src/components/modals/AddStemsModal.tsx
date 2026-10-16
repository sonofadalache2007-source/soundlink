import React, { useState } from 'react';
import { SharedFile } from '../../types/order';

interface AddStemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFile: (file: SharedFile) => void;
}

export const AddStemsModal: React.FC<AddStemsModalProps> = ({
  isOpen,
  onClose,
  onAddFile,
}) => {
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'vocal' | 'zip' | 'reference' | 'stem'>('vocal');
  const [fileSize, setFileSize] = useState('36 MB');
  const [fileFormat, setFileFormat] = useState('24-bit 48kHz WAV');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = fileName.trim() || `Stem_Track_${Date.now().toString().slice(-4)}.wav`;
    setIsUploading(true);

    setTimeout(() => {
      onAddFile({
        id: `file-${Date.now()}`,
        name: finalName.endsWith('.wav') || finalName.endsWith('.zip') || finalName.endsWith('.mp3')
          ? finalName
          : `${finalName}.wav`,
        size: fileSize,
        meta: `${fileFormat} • Uploaded Jaxson D.`,
        type: fileType,
      });
      setIsUploading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#191c22] rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#53e076] text-[22px]">upload_file</span>
            <div>
              <h3 className="font-headline font-bold text-lg text-white">Upload Shared Audio Stems</h3>
              <p className="text-xs text-[#bccbb9]">Add stems or references to Order #SL-88492</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#272a31] text-[#bccbb9] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Simulated Drop Area */}
          <div className="border-2 border-dashed border-[#53e076]/40 hover:border-[#53e076] bg-[#10131a] rounded-xl p-5 text-center cursor-pointer transition-colors group">
            <div className="w-10 h-10 rounded-full bg-[#1db954]/20 text-[#53e076] mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
            </div>
            <p className="text-sm font-semibold text-white mt-2">Tap to browse or drop audio stems</p>
            <p className="text-xs text-[#869585] mt-0.5">Supports WAV, AIFF, FLAC, ZIP (Up to 2GB)</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#bccbb9] uppercase tracking-wider mb-1.5">
              Stem Track Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. Lead_Adlibs_Tuned_Dry.wav"
              className="w-full bg-[#10131a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#53e076]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#bccbb9] uppercase tracking-wider mb-1.5">
                Stem Category
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as unknown as 'vocal' | 'zip' | 'reference' | 'stem')}
                className="w-full bg-[#10131a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#53e076]"
              >
                <option value="vocal">Vocal Track (.wav)</option>
                <option value="zip">Stems Archive (.zip)</option>
                <option value="reference">Reference Mix (.mp3)</option>
                <option value="stem">Instrumental Stem (.wav)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#bccbb9] uppercase tracking-wider mb-1.5">
                Sample Specs
              </label>
              <input
                type="text"
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
                placeholder="24-bit 48kHz"
                className="w-full bg-[#10131a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#53e076]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-[#272a31] text-white text-sm font-medium hover:bg-[#32353c] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 py-2.5 rounded-lg bg-[#1db954] hover:bg-[#53e076] text-[#003914] text-sm font-bold shadow-lg shadow-[#1db954]/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              {isUploading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  Uploading...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Add to Workspace
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
