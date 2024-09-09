#!/usr/bin/env bash
# pg-mem does not support specialized numeric types
pg_dump --schema-only --no-owner --no-acl --disable-triggers \
  --no-comments --no-publications --no-security-labels \
  -N snapshot -N sqitch -N sqitch-data \
  --no-subscriptions --no-tablespaces \
  --host "${POSTGRES_HOST:-localhost}" \
  --username "${POSTGRES_USER:-postgres}" \
  "${POSTGRES_DB:-postgres}" |
  sed 's/numeric[(].*[)]/numeric/' |
  sed 's/WITH [(].*[)];/;/'

