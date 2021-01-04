#!/bin/bash
set -e

if [ "$JOB" != "sidekiq" ]; then

  rails db:create db:migrate db:seed

  if [ "$NODE_ENV" = "production" ]; then
    rails assets:precompile
  fi

fi

# Remove a potentially pre-existing server.pid for Rails.
rm -f /myapp/tmp/pids/*.pid

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
