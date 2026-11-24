# HawkbitGUI - modern GUI for the Hawkbit Server

This is a GUI for Eclipse Hawkbit [hawkBit](https://github.com/eclipse-hawkbit/hawkbit), an open-source
backend platform for managing and deploying software and firmware updates to various connected devices.
This project wants to solve the issue of missing GUI as reported in [#1376](https://github.com/eclipse-hawkbit/hawkbit/issues/1376).
It is goal to resolve the strong dependencies, and HawkbitGUI does not need at all to be linked with
Hawkbit's code. It uses the REST API provided by Hawkbit, and it can be installed on any server.

Focus of this project is:
HawkbitGUI claims to solve some issues in Hawkbit:

- remove dependencies from the Hawkbit Server.
  It is a separate project, built outside Hawkbit's Java environment,
  and it just uses the REST API provided by Hawkbit.
- GUI and server do not need to run on the same server. GUI can be configured with which server must be connected
  design easier to change, even if it currently resembles the previous GUI.
- better UX

## License

This Software is licensed under GPLv3.

## Getting Started

### System requirements

- Node.js `>= 20.9.0` (required by Next.js `16.2.1`)
- npm `>= 10.1.0` (or the npm version bundled with Node.js `20.9+`)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file (you can copy from `.env.example`) and set:

```dotenv
NEXTAUTH_SECRET=replace-with-a-long-random-secret
NEXTAUTH_URL=http://localhost:3000
HAWKBIT_API_URL=http://localhost:8080
```

Notes:

- `NEXTAUTH_SECRET` should be a strong random string.
- `NEXTAUTH_URL` must match the URL where users access HawkbitGUI.
- `HAWKBIT_API_URL` must point to your Hawkbit server base URL. It is read at runtime by the
  server-side proxy, so the same Docker image can be used with different Hawkbit servers.

### 3) Development mode

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4) Production mode

Create an optimized build and run it:

```bash
npm run build
npm run start
```

The app runs on port `3000` by default.

## Docker

The `Dockerfile` has two targets: `development-build-stage` (runs `next dev`) and
`production-build-stage` (runs `next build` and then `next start`). The container runs as the
non-root `node` user. No configuration is baked into the image: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
and `HAWKBIT_API_URL` are passed when the container starts, so one image works with any Hawkbit server.

### Multi-architecture build (amd64 + arm64)

A multi-platform image needs a Buildx builder with the `docker-container` driver, plus QEMU
emulation for the architecture your machine does not run natively. One-time setup:

```bash
# Register the QEMU emulators. Registrations are lost on reboot unless your distribution
# installs them permanently (e.g. the qemu-user-static package).
docker run --privileged --rm tonistiigi/binfmt --install arm64,amd64

# Create a multi-platform builder
docker buildx create --name hawkbitgui-builder --driver docker-container
docker buildx inspect hawkbitgui-builder --bootstrap   # "Platforms" must list linux/amd64 and linux/arm64
```

The build command below selects this builder with `--builder`, so the default builder (used by your other
projects) does not change. Without it Buildx uses the current builder, and if that one uses the `docker` driver
the build fails with `Multi-platform build is not supported for the docker driver`. Any other builder with the
`docker-container` driver works as well: list them with `docker buildx ls`.

Build both architectures and push them to a registry as a single multi-arch image
(run `docker login <registry>` first):

```bash
docker buildx build \
  --builder hawkbitgui-builder \
  --platform linux/amd64,linux/arm64 \
  --target production-build-stage \
  -t <registry>/<namespace>/hawkbitgui:<version> \
  --push \
  .
```

Notes:

- A multi-platform image cannot be loaded into the local image store with `--load`, unless your
  Docker Engine uses the containerd image store. To test an architecture locally, build it alone:
  `docker buildx build --platform linux/arm64 --target production-build-stage --load -t hawkbitgui:arm64 .`
- The emulated architecture builds much more slowly: under QEMU the `next build` step can take
  several minutes.
- `.dockerignore` keeps `.env*`, `node_modules`, `.next` and `.git` out of the build context.
  Dependencies are installed inside the build for each target architecture, never copied from the host.

### Run the image

```bash
docker run -d -p 3000:3000 \
  -e NEXTAUTH_SECRET=replace-with-a-long-random-secret \
  -e NEXTAUTH_URL=https://hawkbitgui.example.com \
  -e HAWKBIT_API_URL=http://hawkbit.example.com:8080 \
  <registry>/<namespace>/hawkbitgui:<version>
```

Docker automatically pulls the variant that matches the host architecture.

## Configuration

You have to set the URL of the Hawkbit Server with the `HAWKBIT_API_URL` variable (in `.env`, or as a container environment variable).
