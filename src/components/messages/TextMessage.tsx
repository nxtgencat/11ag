import React from 'react';

interface TextMessageProps {
  text: string;
}

export const TextMessage: React.FC<TextMessageProps> = ({ text }) => {
  // Parse WhatsApp markdown & links (*bold*, _italic_, ~strike~, URLs)
  const formatText = (content: string) => {
    // Regex for URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:opacity-80 break-all"
          >
            {part}
          </a>
        );
      }

      // Format bold, italic, strikethrough
      let formatted: React.ReactNode = part;

      return (
        <span key={i} className="whitespace-pre-wrap break-words leading-relaxed">
          {formatted}
        </span>
      );
    });
  };

  return (
    <div className="text-sm font-sans select-text">
      {formatText(text)}
    </div>
  );
};
