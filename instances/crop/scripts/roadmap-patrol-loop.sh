#!/usr/bin/env bash
# CROP Denis roadmap patrol — 30m tick. Counter incremented on each wake.
set -euo pipefail
STATE="/Users/denistka/Projects/clinton-tracktor/totem/instances/crop/patrol-state.json"
INTERVAL=1800

while true; do
  sleep "$INTERVAL"
  COUNT=$(python3 -c "
import json, datetime
from pathlib import Path
p = Path('$STATE')
d = json.loads(p.read_text()) if p.exists() else {}
d['autolaunch_count'] = int(d.get('autolaunch_count', 0)) + 1
d['last_tick_at'] = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
p.write_text(json.dumps(d, indent=2) + '\n')
print(d['autolaunch_count'])
")
  echo "AGENT_LOOP_TICK_crop-roadmap {\"autolaunch\":${COUNT},\"prompt\":\"CROP roadmap patrol #${COUNT}: read patrol-state.json. Check #1544 + merge queue + #1538. If actionable work → set pending_work, notify user, WAIT for denistka (do NOT execute). If no work → silent, update last_result no_work.\"}"
done
