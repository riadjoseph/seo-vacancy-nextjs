import { Link } from "react-router-dom";

interface JobTagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

const JobTags = ({ tags = [], onTagClick }: JobTagsProps) => {
  if (!tags || tags.length === 0) return null;

  const formatTagForUrl = (tag: string) => {
    return tag.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.slice(0, 5).map((tag) => (
        <Link
          key={tag}
          to={`/jobs/tag/${formatTagForUrl(tag)}`}
          className="text-sm px-2 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
};

export default JobTags;