import React, { useState } from 'react';
import { Attachment } from '../../types';
import { FileText, Download, Maximize2, X } from 'lucide-react';

interface DocumentMessageProps {
  attachment: Attachment;
}

export const DocumentMessage: React.FC<DocumentMessageProps> = ({ attachment }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isPdf = () => {
    const mime = (attachment.mimeType || '').toLowerCase();
    const name = (attachment.fileName || '').toLowerCase();
    return mime === 'application/pdf' || mime.includes('pdf') || name.endsWith('.pdf');
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = attachment.url;
    a.download = attachment.fileName || 'document.pdf';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getExtension = (fileName = '') => {
    const ext = fileName.split('.').pop();
    return ext ? ext.toUpperCase() : 'DOC';
  };

  return (
    <>
      <div className="p-3 rounded-xl bg-ink/5 dark:bg-white/5 border border-line dark:border-linedark max-w-sm">
        {isPdf() && (
          <div className="relative mb-2 rounded-lg overflow-hidden border border-line dark:border-linedark bg-white">
            <iframe
              src={attachment.url}
              title={attachment.fileName || 'PDF preview'}
              className="w-full h-44 pointer-events-none"
            />
            <div className="absolute inset-0 bg-transparent" />
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* File Icon Badge */}
          <div className="w-10 h-10 rounded-lg bg-cobalt/15 text-cobalt dark:text-cobalt-light flex flex-col items-center justify-center shrink-0">
            <FileText className="w-5 h-5 stroke-[1.5]" />
            <span className="text-[8px] font-mono font-bold tracking-wider">
              {getExtension(attachment.fileName)}
            </span>
          </div>

          {/* File Details */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ink dark:text-paperdark truncate">
              {attachment.fileName || 'Document.pdf'}
            </p>
            <p className="text-[10px] text-slate dark:text-slatedark font-mono mt-0.5">
              {attachment.fileSize || '2.4 MB'}
              {attachment.pageCount ? ` · ${attachment.pageCount} pages` : ''}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {isPdf() && (
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="btn-icon w-8 h-8 shrink-0 hover:border-cobalt hover:text-cobalt transition-colors"
                title="Preview PDF"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleDownload}
              className="btn-icon w-8 h-8 shrink-0 hover:border-cobalt hover:text-cobalt transition-colors"
              title="Download Document"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Full Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setIsPreviewOpen(false)}>
          <div
            className="w-full max-w-3xl h-[85vh] card p-0 overflow-hidden flex flex-col animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-line dark:border-linedark">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-display font-semibold text-sm text-ink dark:text-paperdark truncate">
                  {attachment.fileName || 'Document.pdf'}
                </span>
                <span className="mini-tag font-mono text-[10px] shrink-0">{getExtension(attachment.fileName)}</span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="btn-icon w-8 h-8 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 bg-[#525659] dark:bg-black">
              <iframe src={attachment.url} title="PDF preview" className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};