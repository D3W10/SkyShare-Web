FROM oven/bun:1 AS base
WORKDIR /webapp

# Install dependencies
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Copy your app code
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV VITE_API_URL=http://20.86.131.181/api/v1
ENV VITE_AUTH_URL=http://20.86.131.181:8000
ENV VITE_ORG_NAME=skyshare

RUN bun run build

EXPOSE 4173
ENTRYPOINT [ "bun", "run", "host" ]