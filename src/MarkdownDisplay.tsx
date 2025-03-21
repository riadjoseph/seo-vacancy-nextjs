import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownDisplayProps {
  markdown: string;
  pollInterval?: number; // milliseconds
  onFetch?: () => Promise<string>; // function to fetch new content
}

const MarkdownDisplay = ({ markdown: initialMarkdown, pollInterval, onFetch }: MarkdownDisplayProps) => {
  const [content, setContent] = useState(initialMarkdown);

  useEffect(() => {
    if (!pollInterval || !onFetch) return;

    const fetchContent = async () => {
      try {
        const newContent = await onFetch();
        setContent(newContent);
      } catch (error) {
        console.error('Failed to fetch markdown content:', error);
      }
    };

    const intervalId = setInterval(fetchContent, pollInterval);
    return () => clearInterval(intervalId);
  }, [pollInterval, onFetch]);

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownDisplay;
