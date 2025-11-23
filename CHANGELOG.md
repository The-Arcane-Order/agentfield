# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- changelog:entries -->

## [0.1.8] - 2025-11-23


### Other

- Automate changelog generation with git-cliff

Integrates git-cliff into the release workflow to automatically generate changelog entries from commit history. This streamlines the release process by eliminating manual changelog updates.

The CONTRIBUTING.md file has been updated to reflect this new process and guide contributors on how to structure their commits for effective changelog generation. A new script, `scripts/update_changelog.py`, is called to perform the changelog update during the release process. (d3e1146)

- Refactors agent AI token counting and trimming

Replaces lambda functions for `token_counter` and `trim_messages` with explicit function definitions in `AgentAI` to improve clarity and maintainability.

Additionally, this commit removes an unused import in `test_discovery_api.py` and cleans up some print statements and a redundant context manager wrapper in `test_go_sdk_cli.py` and `test_hello_world.py` respectively. (7880ff3)

- Remove unused Generator import

Removes the `Generator` type hint from the imports in `conftest.py`, as it is no longer being used. This is a minor cleanup to reduce unnecessary imports. (7270ce8)

- Final commit (1aa676e)

- Add discovery API endpoint

Introduces a new endpoint to the control plane for discovering agent capabilities.
This includes improvements to the Python SDK to support querying and parsing discovery results.

- Adds `InvalidateDiscoveryCache()` calls in node registration handlers to ensure cache freshness.
- Implements discovery routes in the control plane server.
- Enhances the Python SDK with `discover` method, including new types for discovery responses and improved `Agent` and `AgentFieldClient` classes.
- Refactors `AsyncExecutionManager` and `ResultCache` for lazy initialization of asyncio objects and `shutdown_event`.
- Adds new types for discovery API responses in `sdk/python/agentfield/types.py`.
- Introduces unit tests for the new `discover_capabilities` functionality in the client. (ab2417b)

- Updated (6f1f58d)

- Initial prd (4ed1ea5)

- Adds decorator-based API for global memory event listeners

Introduces a decorator to simplify subscribing to global memory change events,
enabling more readable and maintainable event-driven code.

Enhances test coverage by verifying event listener patterns via functional tests,
ensuring decorators correctly capture events under various scenarios. (608b8c6)

- Update functional tests and docker configuration

- Remove PRD_GO_SDK_CLI.md document
- Update docker compose configurations for local and postgres setups
- Modify test files for Go SDK CLI and memory events (4fa2bb7)

- Adds CLI support and configuration to agent module

Introduces options for registering CLI-accessible handlers, custom CLI formatting, and descriptions.
Adds a configuration struct for CLI behavior and presentation.
Refactors agent initialization to allow operation without a server URL in CLI mode.
Improves error handling and test coverage for new CLI logic. (54f483b)

- Prd doc (d258e72)

- Update README.md (3791924)

- Update README.md (b4bca5e)



### Testing

- Testing runs functional test still not working id errors (6da01e6)

## [0.1.2] - 2025-11-12
### Fixed
- Control-plane Docker image now builds with CGO enabled so SQLite works in containers like Railway.

## [0.1.1] - 2025-11-12
### Added
- Documentation chatbot + advanced RAG examples showcasing Python agent nodes.
- Vector memory storage backends and skill test scaffolding for SDK examples.

### Changed
- Release workflow improvements (selective publishing, prerelease support) and general documentation updates.

## [0.1.0] - 2024-XX-XX
### Added
- Initial open-source release with control plane, Go SDK, Python SDK, and deployment assets.

### Changed
- Cleaned repository layout for public distribution.

### Removed
- Private experimental artifacts and internal operational scripts.
