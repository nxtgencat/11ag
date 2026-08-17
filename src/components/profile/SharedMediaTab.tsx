import React, { useState } from 'react';
import { Message } from '../../types';
import { SAMPLE_DOCUMENTS, SAMPLE_PHOTOS, SAMPLE_LINKS } from '../../data/sampleMedia';
import { ExternalLink, Play, Download } from 'lucide-react';
import { MediaViewerModal } from '../media/MediaViewerModal';

interface SharedMediaTabProps {
  messages: Message[];
}

export const SharedMediaTab: React.FC<SharedMediaTabProps> = ({ messages }) => {
  const [activeSubTab, setActiveSubTab] = useState<'media' | 'docs' | 'links'>('media');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Collect images & videos from messages, supplemented by sample gallery
  const mediaItems = messages
    .filter((m) => m.type === 'image' || m.type === 'video')
    .map((m) => ({
      url: m.attachment?.url || '',
      thumb: m.attachment?.thumbnailUrl || m.attachment?.url || '',
      type: m.type,
      caption: m.text,
    }));

  const allMedia = mediaItems.length > 0 ? mediaItems : SAMPLE_PHOTOS.map(p => ({
    url: p.url,
    thumb: p.thumbnail,
    type: 'image',
    caption: p.caption,
  }));

  const docItems = messages
    .filter((m) => m.type === 'document')
    .map((m) => ({
      name: m.attachment?.fileName || 'Document.pdf',
      size: m.attachment?.fileSize || '2.4 MB',
      pages: m.attachment?.pageCount || 5,
      url: m.attachment?.url || '#',
    }));

  const allDocs = docItems.length > 0 ? docItems : SAMPLE_DOCUMENTS;

  return (
    <div className="space-y-3">
      {/* Sub Tabs */}
      <div className="flex border-b border-[#e9edef] dark:border-[#2a3942] text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('media')}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            activeSubTab === 'media'
              ? 'border-wa-green text-wa-green-deep dark:text-wa-green'
              : 'border-transparent text-[#667781] dark:text-[#8696a0]'
          }`}
        >
          Media ({allMedia.length})
        </button>
        <button
          onClick={() => setActiveSubTab('docs')}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            activeSubTab === 'docs'
              ? 'border-wa-green text-wa-green-deep dark:text-wa-green'
              : 'border-transparent text-[#667781] dark:text-[#8696a0]'
          }`}
        >
          Docs ({allDocs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('links')}
          className={`flex-1 py-2 text-center border-b-2 transition-colors ${
            activeSubTab === 'links'
              ? 'border-wa-green text-wa-green-deep dark:text-wa-green'
              : 'border-transparent text-[#667781] dark:text-[#8696a0]'
          }`}
        >
          Links ({SAMPLE_LINKS.length})
        </button>
      </div>

      {/* Media Gallery Grid */}
      {activeSubTab === 'media' && (
        <div className="grid grid-cols-3 gap-1.5 max-h-60 overflow-y-auto">
          {allMedia.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(item.url)}
              className="relative aspect-square rounded-lg overflow-hidden bg-black/10 cursor-pointer group"
            >
              <img
                src={item.thumb}
                alt="Shared Media"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-5 h-5 fill-white text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Docs List */}
      {activeSubTab === 'docs' && (
        <div className="space-y-2 max-h-60 overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#2a3942]">
          {allDocs.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 gap-2 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-9 rounded bg-rose-500 text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                  PDF
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                    {doc.name}
                  </p>
                  <p className="text-[10px] text-[#8696a0] font-mono">
                    {doc.size} {doc.pages ? `· ${doc.pages} pages` : ''}
                  </p>
                </div>
              </div>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-[#8696a0] hover:text-wa-green"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Links List */}
      {activeSubTab === 'links' && (
        <div className="space-y-2.5 max-h-60 overflow-y-auto">
          {SAMPLE_LINKS.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-xl bg-[#f0f2f5] dark:bg-[#202c33] hover:bg-[#e9edef] dark:hover:bg-[#2a3942] transition-colors"
            >
              <img
                src={link.thumbnail}
                alt={link.title}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0 text-xs">
                <p className="font-semibold text-[#111b21] dark:text-[#e9edef] truncate">
                  {link.title}
                </p>
                <p className="text-[10px] text-[#8696a0] truncate font-mono">
                  {link.domain}
                </p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#8696a0] shrink-0 mr-1" />
            </a>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {selectedPhoto && (
        <MediaViewerModal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          mediaUrl={selectedPhoto}
        />
      )}
    </div>
  );
};
