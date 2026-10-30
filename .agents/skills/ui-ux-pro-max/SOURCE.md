# Local installation

- Upstream: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Commit: `28b3b8dee8c976df4fa3e94aed4e092ad43fcb03`
- Source directory: `.claude/skills/ui-ux-pro-max/`
- Installation scope: this repository, at `.agents/skills/ui-ux-pro-max/`.
- Runtime: Python 3 standard library; no third-party packages.

## Local adjustments

`SKILL.md` uses `python3` and project-relative Codex paths instead of Claude plugin environment variables. Resolve the script path from this skill's location when running outside the repository root.

The upstream MIT license is included as `LICENSE`. Local Python cache files are ignored. The bundled data, references, scripts, and tests are otherwise unchanged.

## Usage

On your next turn, invoke `$ui-ux-pro-max` with a UI/UX task. Codex discovers project skills automatically; restart Codex if it does not appear.

From the repository root:

```sh
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "Minimalism" --domain style
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "scoped styles" --stack astro
```

Generate a design-system recommendation with `--design-system`. Add `--persist` and an explicit `--output-dir` only when you want to save a reviewed design direction.
