# Invariant block template
#
# Embed one or more of these fenced blocks inside S*-INVARIANTS.md
# or CURRENT-INVARIANTS.md. Surround with human prose as needed.
# See core/INVARIANTS.ti for field definitions.

```inv
id: INV-{{PROJECT}}-001
date: {{YYYY-MM-DD}}
severity: hard
status: active
confirmed_by: {{git-sha}}
assertion: file_exists
path: package.json
why: Root package manifest is required for install/start.
added_by: ARCHITECT
sprint: S01
```

# Assertion type examples (pick one assertion + its fields)
#
# file_exists / path_absent:
#   assertion: file_exists
#   path: src/index.ts
#
# glob_exists / glob_absent:
#   assertion: glob_absent
#   glob: "**/.env.local"
#
# port:
#   assertion: port
#   path: vite.config.ts
#   port: 5173
#
# config_value:
#   assertion: config_value
#   path: package.json
#   key: name
#   expect: my-app
#
# command:
#   assertion: command
#   cmd: test -d src
