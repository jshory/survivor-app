# Survivor Fantasy Pool App

This app enables a small Survivor fantasy pool to quickly and easily update and view weekly scores based on recent episodes.

An admin-only Google Sheet is used on the back-end for storing fantasy teams, contestants, and weekly scores.

[Google Sheet Template](https://docs.google.com/spreadsheets/d/1UDtPZNvwXvWL_NUjUVSL7e7VLbFcjbi5hXFSa5Xn2gc/edit?usp=sharing)

[Google Sheet How-To Guide](https://docs.google.com/document/d/15_4x5iSe5e8OFQDNzzDmFTuNevTXQtGZmFwJZGA1roc/edit?usp=sharing)

A Nuxt app is used on the front-end to display all pool information, for members to access and view weekly updates.

## Installation

Open both API and UI packages and install dependencies.

```bash
npm install
```

Set-up a new Google Cloud project, using the instructions [here](https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication) (follow steps in the "Setting up Your Application" section).

Copy and paste the .env.sample file in the API package, and fill in your Google account email and private key variables. Once you set-up your Google Template, you can copy and paste the sheet ID into the appropriate .env variable as well.
