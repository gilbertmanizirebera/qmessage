# QMessage

Simple static single-page app served via Surge.

## Local

Preview locally by opening `index.html` in a browser.

## Deploy to Surge (manual)

Install Surge CLI then deploy from the project root:

```bash
npm install -g surge
cd /workspaces/qmessage
# first-time: surge (will prompt for email/password)
surge --project . --domain qmessage.surge.sh
```

## CI / Auto-deploy (GitHub Actions)

This repo contains a workflow that minifies `index.html` and deploys to Surge on push to `main`.

Requirements:
- Create a Surge token: `surge token` (see Surge docs)
- Add a repository secret named `SURGE_TOKEN` containing the token

The action uses the `qmessage.surge.sh` domain configured in the `CNAME` file.

## Analytics

A GA4 placeholder snippet is included in `index.html`. Replace `G-XXXXXXX` with your measurement ID.

## Notes

- To use a custom domain, update the `CNAME` file and configure your DNS provider.
- The GitHub action uses `npx html-minifier-terser` to minify HTML before deploy.