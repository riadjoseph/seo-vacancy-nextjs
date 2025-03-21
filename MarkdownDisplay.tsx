import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownDisplayProps {
  markdown: string;
}

const MarkdownDisplay = ({ markdown }: MarkdownDisplayProps) => {
  return (
    <ReactMarkdown
      children={markdown}
      remarkPlugins={[remarkGfm]}
      className="prose prose-sm md:prose-base prose-headings:font-bold prose-strong:text-black dark:prose-strong:text-white" // Add the prose class here
    />
  );
};

export default MarkdownDisplay;
