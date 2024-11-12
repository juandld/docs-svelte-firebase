# Dockerfile
FROM denoland/deno:latest

WORKDIR /app

# Copy only the package files first
COPY package.json ./
COPY svelte.config.js ./

# Then copy the rest of the application
COPY . .

ENV DENO_DIR=/deno-dir
ENV PATH="/deno-dir/bin:$PATH"

EXPOSE 3000

# Development command using npm compatibility
CMD ["deno", "run", "-A", "--node-modules-dir", "npm:vite", "dev", "--host"]

