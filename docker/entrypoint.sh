#!/bin/sh
set -e

COMMAND=$1 && shift 1

function build_if_needed {
    if [ ! -d  'dist' ]; then
      echo "Building the project..."
      yarn build
    fi
}

case "$COMMAND" in
  'start-local' )
    build_if_needed
    echo "Starting Local Web..."
    yarn start
    ;;

  'start-web' )
    build_if_needed
    echo "Starting Web..."
    yarn start
    ;;

  'start-worker' )
    build_if_needed
    echo "Starting Worker..."
    yarn worker
    ;;

   * )
    echo "Unknown command"
    ;;
esac

exec "$@"