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
NEXT_PUBLIC_HAWKBIT_API_URL=http://localhost:8080
```

Notes:

- `NEXTAUTH_SECRET` should be a strong random string.
- `NEXTAUTH_URL` must match the URL where users access HawkbitGUI.
- `NEXT_PUBLIC_HAWKBIT_API_URL` must point to your Hawkbit server base URL.

Optional:

- `SESSION_IDLE_TIMEOUT`: idle timeout of the login session, in seconds (default `3600`). The session expires only
  after this time without user activity: clicks, key presses, scrolling (wheel, touch or keyboard) and coming back
  to the browser tab. The background refresh of the pages does not keep it alive. While the user is active the
  session is renewed at most once a minute (every quarter of the timeout, if that is shorter). When the session
  expires the user is sent to the login page and, after logging in again, back to the page they were on. The value
  is read at runtime, so it can be changed in the container without rebuilding the image; an invalid value is
  logged as a warning and the default is used.

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

You have to set in `.env` the URL for the Hawkbit Server by setting the `NEXT_PUBLIC_HAWKBIT_API_URL` variable.
