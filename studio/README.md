# Llos Sanity Studio Starter

Welcome to LLOS& starter for Sanity Content Studio. Sanity is an **open source** modern headless CMS (Content Management System). Sanity uses **structured content** to endlessly re-use content across any channel and a composable approach to help businesses connect to any third-party technology, data source, and front end framework.

You can see our Studio working at **demo site** in the Llos' sanity.io account:
https://llos-starter.sanity.studio/

## Getting Started: the local studio

First, install [sanity CLI](https://www.sanity.io/docs/cli) for managing, developing, debugging, and deploying Sanity Studio.

Then, install the necessary dependencies:

```sh-session
$ sanity install
```

Create a sanity.io project and generate `.env` file with mandatory vars SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET using:

```sh-session
$ sanity init --env .env
```

Create `.env.local` from `.env.local.example` and upadte vars to match your project

Finally, start the development server (localhost:3333):

```sh-session
$ sanity dev
```

## Manage and deploy: the Sanity.io studio

The content of the project is **always synced between localhost and sanity.io**.

To sync the code, you can upload code changes to sanity.io project anytime you need with:

```sh-session
$ sanity deploy
```

You can quickly open sanity.io project desk from terminal by using sanity manage command:

```sh-session
$ sanity manage
```

## Sanity CLI export/import

Export a full data backup:

```sh-session
$ sanity dataset export
```

Import/replace a full data backup:

```sh-session
$ sanity dataset import
```

## Create new Favicons

You can create new favicons from the current static/favicon.svg.

First install "create-favicon" globally:

```sh-session
npm install -g create-favicon
```

Then run this command to create the favicons:

```sh-session
npm create favicon static/favicon.svg static/favicons
```

## Plugins we are using in the studio:

- `@sanity/vision`: adds a groq query playground for debugging purposes.

- `sanity-plugin-media`: adds visual media library to allow to manage media from management UI.

- `@sanity/orderable-document-list`: allows us to add custom ordering to documents.

- `@sanity/dashboard`: creates a dashboard area where you can add widgets as Netlify deploy.

- `sanity-plugin-dashboard-widget-netlify`: adds the netlify deploy widget to the dashboard area.

- `@focus-reactive/sanity-plugin-inline-svg-input`: Adds 'inlineSvg' field type to allow you to get uploaded svgs as inline html intead of media object from frontend.


## Sanity deploy automation:

To automate the "sanity deploy" process so it is triggered each time you push to the main branch, follow these steps.

This is especially useful for deploying a Sanity instance using a token instead of an admin user.

### Steps:

1. Rename `gitlab-ci.yml.example` to `gitlab-ci.yml`.
2. Obtain a Sanity token with deploy permissions from your Sanity admin (Admin > API > Token).
2. Add the required environment variables as CI variables in GitLab (Sidebar > Settings > CI/CD > Variables).

    You must set the same environment variables as for a manual deploy (env file) plus the Sanity token:

- `SANITY_AUTH_TOKEN`
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `SANITY_STUDIO_NETLIFY_SITE_ID`
- `SANITY_STUDIO_NETLIFY_BUILD_HOOK_ID`
- `SANITY_STUDIO_PREVIEW_URL`
- `SANITY_STUDIO_PRODUCTION_URL`

**Important:** If your main branch is protected (you can't push directly to it), enable the 'Protect variable' flag when creating the variable for better protection. Otherwise, uncheck it so the variable will be reachable.

## Other resources

If you like you can now explore the following resources:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the community Slack](https://slack.sanity.io/?utm_source=readme)
- [How to extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

[Web development checklist](https://www.notion.so/Web-development-checklist-15a108e532e18014b82bcb5d58c15b09)  