import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

import { LinkWithTags } from "../../../bindings"
import { Badge } from "../ui/badge"


export function LinkCard({ link }: {link: LinkWithTags}) {

  const {id, name, url, description, archived, collectionId, tags} = link
  return (
    <Card className="w-full" key={id}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <a href={url} target="_blank" rel="noreferrer">
          <Button>Visit</Button>
        </a>
      </CardContent>
      <CardFooter className="flex flex-wrap ">
        {link.tags.map((tag) => (
          <Badge 
            key={tag.id} 
            style={{
              backgroundColor: `${tag.color}30`,
              color: tag.color,
              borderColor: `${tag.color}20`,
            }}
          >
            {tag.name}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  )

}

