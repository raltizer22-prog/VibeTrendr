# CodeGraph setup

This repo is wired for CodeGraph.

## Commands

- `npm run codegraph:init` — initialize the local graph for this repo
- `npm run codegraph:status` — inspect graph health / stats
- `npm run codegraph:sync` — refresh the index after code changes

## Shared bootstrap

Use the shared script for any repo:

```bash
/opt/data/scripts/codegraph-bootstrap.sh /path/to/repo
```

Or run it in the current directory:

```bash
/opt/data/scripts/codegraph-bootstrap.sh
```

## Future repos

The reusable flow is:

1. Install CodeGraph globally if needed:
   - `npm i -g @colbymchenry/codegraph`
2. Bootstrap the repo with the shared script:
   - `/opt/data/scripts/codegraph-bootstrap.sh /path/to/repo`
3. Keep the project’s `.gitignore` clean so build output and secrets stay out of the graph.

## Notes

CodeGraph is local-first and respects `.gitignore`, so it’s safe to use as a repo-level coding assistant helper.
