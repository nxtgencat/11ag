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

  const getDocBadgeColor = (fileName = '') => {
    if (fileName.endsWith('.pdf')) return 'bg-rose-500 text-white';
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) return 'bg-emerald-600 text-white';
    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return 'bg-blue-600 text-white';
    return 'bg-indigo-500 text-white';
  };

  const getExtension = (fileName = '') => {
    const ext = fileName.split('.').pop();
    return ext ? ext.toUpperCase() : 'DOC';
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/5 dark:bg-black/20 max-w-sm border border-[#e9edef] dark:border-[#2a3942]">
      {/* File Icon Badge */}
      <div className={`w-12 h-14 rounded-lg ${getDocBadgeColor(attachment.fileName)} flex flex-col items-center justify-center shrink-0 shadow-2xs`}>
        <FileText className="w-6 h-6 stroke-1 mb-0.5" />
        <span className="text-[9px] font-bold tracking-wider">
          {getExtension(attachment.fileName)}
        </span>
      </div>

      {/* File Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate">
          {attachment.fileName || 'Document.pdf'}
        </p>
        <p className="text-xs text-[#667781] dark:text-[#8696a0] font-mono mt-0.5">
          {attachment.fileSize || '2.4 MB'}
          {attachment.pageCount ? ` · ${attachment.pageCount} pages` : ''}
        </p>
      </div>

      {/* Download Action */}
      <button
        onClick={handleDownload}
        className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[#54656f] dark:text-[#aebac1] hover:text-wa-green transition-colors shrink-0"
        title="Download Document"
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
};
