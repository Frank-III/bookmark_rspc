
![logo](public/Bookmarks.png)

# Bookmarks for devs

An Opnionated Bookmarks app, inspired by linkwarden.

## Usage

```bash
# Terminal One
cd web
pnpm i
pnpm web:dev

# Terminal Two
cargo run
```


how to get shared links

create another folder to store db queries, should I? seems fine

1 additional arg: includeShare -> boolean 
2 get all links the user has acess to:
  - no include shared:
    still to current implements
  - include:
    1. user and collections to get all collections 
    2. iter all collections on the getters 
