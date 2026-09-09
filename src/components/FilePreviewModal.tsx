import React from 'react';
import { X, Download, FileText, ExternalLink, Calendar, HardDrive } from 'lucide-react';
import { UserUploadedFile } from '../types';

interface FilePreviewModalProps {
  file: UserUploadedFile | null;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose }) => {
  if (!file) return null;

  const isImage = file.fileType.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(file.fileName);
  const isPdf = file.fileType === 'application/pdf' || /\.pdf$/i.test(file.fileName);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const previewSource = file.downloadUrl || file.dataUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="min-w-0 pr-4">
            <h3 className="text-sm font-bold text-slate-900 truncate" title={file.fileName}>
              {file.fileName}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {file.uploadDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5" />
                {formatSize(file.fileSize)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {previewSource && (
              <a
                href={previewSource}
                download={file.fileName}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-100/60 min-h-[280px]">
          {isImage && previewSource ? (
            <img
              src={previewSource}
              alt={file.fileName}
              className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-sm border border-slate-200"
            />
          ) : isPdf && previewSource ? (
            <iframe
              src={previewSource}
              title={file.fileName}
              className="w-full h-[60vh] rounded-lg border border-slate-200"
            />
          ) : (
            <div className="text-center p-8 bg-white rounded-xl border border-slate-200 shadow-xs max-w-sm">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800 mb-1">{file.fileName}</h4>
              <p className="text-xs text-slate-500 mb-4">
                File format ({file.fileType}). You can view or download the file directly.
              </p>
              {previewSource && (
                <a
                  href={previewSource}
                  download={file.fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition"
                >
                  <Download className="w-4 h-4" />
                  Download File ({formatSize(file.fileSize)})
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        {file.description && (
          <div className="px-5 py-3 border-t border-slate-100 bg-white text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Notes:</span> {file.description}
          </div>
        )}
      </div>
    </div>
  );
};
