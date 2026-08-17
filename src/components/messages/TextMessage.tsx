import React from 'react';

interface TextMessageProps {
  text: string;
}

export const TextMessage: React.FC<TextMessageProps> = ({ text }) => {
  // Parse WhatsApp text formatting (*bold*, _italic_, ~strike~, code) and URLs
  const renderFormattedText = (raw: string) => {
    // URL matching regex
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = raw.split(urlRegex);

    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-wa-blue hover:underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }

      // Simple formatting parser: *bold*, _italic_, ~strike~
      let formatted: React.ReactNode = part;

      // *bold*
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <strong key={i}>{part.slice(1, -1)}</strong>;
      }
      // _italic_
      if (part.startsWith('_') && part.endsWith('_') && part.length > 2) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      // ~strike~
      if (part.startsWith('~') && part.endsWith('~') && part.length > 2) {
        return <del key={i}>{part.slice(1, -1)}</del>;
      }

      return <span key={i}>{formatted}</span>;
    });
  };

  return (
    <div className="text-sm text-[#111b21] dark:text-[#e9edef] whitespace-pre-wrap break-words leading-relaxed">
      {renderFormattedText(text)}
    </div>
  );
};
