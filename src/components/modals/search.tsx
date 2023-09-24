import React from 'react';
import { Command } from 'cmdk';
import { Tag } from 'lucide-react';


const Groups = [
  {
    name: 'Tags',
    items: [
      {
        name: 'Search Tags...',
        shortcut: 'S P',
        icon: <Tag />,
        action: 'searchProjects',
      },
      {
        name: 'Create New Project...',
        shortcut: 'S P',
        icon: 'plus',
        action: 'createProject',
      },
    ],
  },
  {
    name: 'Collections',
    items: [
      {
        name: 'Search Teams...',
        shortcut: '⇧ P',
        icon: 'teams',
        action: 'searchTeams',
      },
      {
        name: 'Create New Team...',
        shortcut: '⇧ P',
        icon: 'plus',
        action: 'createTeam',
      },
    ],
  },
  {
    name: 'Links',
    items: [
      {
        name: 'Search Docs...',
        shortcut: '⇧ D',
        icon: 'docs',
        action: 'searchDocs',
      },
      {
        name: 'Send Feedback...',
        shortcut: '⇧ D',
        icon: 'feedback',
        action: 'sendFeedback',
      },
      {
        name: 'Contact Support',
        shortcut: '⇧ D',
        icon: 'contact',
        action: 'contactSupport',
      },
    ],
  },
];


export function VercelCMDK() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = React.useState('');

  const [stage, setStage] = React.useState<string[]>(['home']);
  const activeStage = stage[stage.length - 1];
  const isHome = activeStage === 'home';

  const popPage = React.useCallback(() => {
    setStage((stage) => {
      const x = [...stage];
      x.splice(-1, 1);
      return x;
    });
  }, []);

  const onKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (isHome || inputValue.length) {
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        popPage();
      }
    },
    [inputValue.length, isHome, popPage],
  );

  function bounce() {
    if (ref.current) {
      ref.current.style.transform = 'scale(0.96)';
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = '';
        }
      }, 100);

      setInputValue('');
    }
  }

  return (
    <div className='searchOverlay'>
      <Command
        ref={ref}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter') {
            bounce();
          }

          if (isHome || inputValue.length) {
            return;
          }

          if (e.key === 'Backspace') {
            e.preventDefault();
            popPage();
            bounce();
          }
        }}
      >
        <div>
          {stage.map((p) => (
            <div key={p} cmdk-vercel-badge=''>
              {p}
            </div>
          ))}
        </div>
        <Command.Input
          autoFocus
          placeholder='What do you need?'
          onValueChange={(value) => {
            setInputValue(value);
          }}
        />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          {activeStage === 'home' && (
            <Home searchProjects={() => setStage([...stage, 'projects'])} />
          )}
          {activeStage === 'projects' && <Projects />}
        </Command.List>
      </Command>
    </div>
  );
}

function Home({ searchProjects }: { searchProjects: Function }) {
  return (
    <>
      <Command.Group heading='Tags'>
        <Item
          shortcut='S P'
          onSelect={() => {
            searchProjects();
          }}
        >
          <ProjectsIcon />
          Search Projects...
        </Item>
        <Item>
          <PlusIcon />
          Create New Project...
        </Item>
      </Command.Group>
      <Command.Group heading='Collections'>
        <Item shortcut='⇧ P'>
          <TeamsIcon />
          Search Teams...
        </Item>
        <Item>
          <PlusIcon />
          Create New Team...
        </Item>
      </Command.Group>
      <Command.Group heading='Links'>
        <Item shortcut='⇧ D'>
          <DocsIcon />
          Search Docs...
        </Item>
        <Item>
          <FeedbackIcon />
          Send Feedback...
        </Item>
        <Item>
          <ContactIcon />
          Contact Support
        </Item>
      </Command.Group>
    </>
  );
}

function Projects() {
  return (
    <>
      <Item>Project 1</Item>
      <Item>Project 2</Item>
      <Item>Project 3</Item>
      <Item>Project 4</Item>
      <Item>Project 5</Item>
      <Item>Project 6</Item>
    </>
  );
}

function Item({
  children,
  shortcut,
  onSelect = () => {},
}: {
  children: React.ReactNode;
  shortcut?: string;
  onSelect?: (value: string) => void;
}) {
  return (
    <Command.Item onSelect={onSelect}>
      {children}
      {shortcut && (
        <div cmdk-vercel-shortcuts=''>
          {shortcut.split(' ').map((key) => {
            return <kbd key={key}>{key}</kbd>;
          })}
        </div>
      )}
    </Command.Item>
  );
}
