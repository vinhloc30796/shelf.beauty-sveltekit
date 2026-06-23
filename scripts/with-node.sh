#!/usr/bin/env bash
set -euo pipefail

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
	echo "nvm is required but was not found at $NVM_DIR/nvm.sh" >&2
	exit 1
fi

# shellcheck source=/dev/null
source "$NVM_DIR/nvm.sh"

if nvm_find_nvmrc >/dev/null; then
	nvm use --silent || {
		nvm install
		nvm use --silent
	}
else
	nvm use --silent default
fi

exec "$@"
