import { useMatches } from '@tanstack/react-router';

export function HeaderTitle() {

  const matches = useMatches()
  console.log(matches)

  return (
    <h1>
      Hi
    </h1>
  ) 
}


