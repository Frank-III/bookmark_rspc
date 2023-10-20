import { Badge } from "../ui/badge";
import { Tag } from "../../../bindings";
import { cn } from "../../utils";

interface TagBadgeProp extends React.HTMLAttributes<HTMLDivElement> {
  tag: Omit<Tag, 'ownerId'>;
  onClick?: () => void;
}

export function TagBadge({
  tag,
  onClick,
  className,
  ...props
}: TagBadgeProp) {
  return (
    <Badge
      key={tag.id}
      className={cn('mb-2', className)} // Add margin at the bottom for spacing
      style={{
        backgroundColor: `${tag.color}30`,
        color: tag.color,
        borderColor: `${tag.color}20`,
        ...props.style,
      }}
      onClick={onClick}
    >
      {tag.name}
    </Badge>
  );
}
