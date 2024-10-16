ARG PORT=3000
FROM oven/bun:1.1
ENV NODE_VERSION=22.8.0

WORKDIR /app

COPY package.json bun.lockb tailwind.config.ts .

RUN bun install --production
RUN bun install -g tailwindcss

COPY src src
COPY tsconfig.json .
COPY public public

RUN bun run build

ENV NODE_ENV=production
ENV PORT=${PORT} 
ENV HOSTNAME=localhost
EXPOSE ${PORT} 

CMD ["bun", "run", "start"]
