#!/bin/bash
# Railway build script that waits for agentfield to be available on PyPI
# This handles the race condition where Railway deploys before PyPI upload completes

set -e

# Extract agentfield version requirement from requirements.txt
AGENTFIELD_REQ=$(grep -E "^agentfield" requirements.txt || echo "")

if [ -z "$AGENTFIELD_REQ" ]; then
    echo "No agentfield requirement found, proceeding with normal install"
    pip install -r requirements.txt
    exit 0
fi

# Parse minimum version from requirement (handles >=X.Y.Z format)
MIN_VERSION=$(echo "$AGENTFIELD_REQ" | sed -E 's/agentfield[>=<]+//' | tr -d ' ')

echo "Waiting for agentfield>=$MIN_VERSION to be available on PyPI..."

MAX_RETRIES=30
RETRY_INTERVAL=10

for i in $(seq 1 $MAX_RETRIES); do
    # Check if the version is available on PyPI
    AVAILABLE=$(pip index versions agentfield 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -20 || echo "")

    if echo "$AVAILABLE" | grep -qE "^${MIN_VERSION}$|^[0-9]+\.[0-9]+\.[1-9][0-9]*$"; then
        # Version found or a higher version exists
        LATEST=$(echo "$AVAILABLE" | head -1)
        echo "Found agentfield $LATEST on PyPI"
        break
    fi

    if [ "$i" -eq "$MAX_RETRIES" ]; then
        echo "Warning: Timed out waiting for agentfield $MIN_VERSION on PyPI"
        echo "Attempting install anyway..."
        break
    fi

    echo "Attempt $i/$MAX_RETRIES: agentfield $MIN_VERSION not yet available, waiting ${RETRY_INTERVAL}s..."
    sleep $RETRY_INTERVAL
done

pip install -r requirements.txt
echo "Installation complete"
