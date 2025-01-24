.PHONY: all format lint

all: format lint

format:
	bun run format

lint:
	bun run lint