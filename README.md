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

## Configuration

You have to set the URL of the Hawkbit Server with the `HAWKBIT_API_URL` variable (in `.env`, or as a container environment variable).
