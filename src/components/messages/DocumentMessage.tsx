import React from 'react';
import { Attachment } from '../../types';
import { FileText, Download } from 'lucide-react';

interface DocumentMessageProps {
  attachment: Attachment;
}

export const DocumentMessage: React.FC<DocumentMessageProps> = ({ attachment }) => {
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
    <div className="flex items-center gap-3 p-3 rounded-xl bg-ink/5 dark:bg-white/5 border border-line dark:border-linedark max-w-sm">
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

      {/* Download Action */}
      <button
        onClick={handleDownload}
        className="btn-icon w-8 h-8 shrink-0 hover:border-cobalt hover:text-cobalt transition-colors"
        title="Download Document"
      >
        <Download className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
