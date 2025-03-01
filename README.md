The john-stack is an opinionated approach to full-stack web applications, with a focus on B2B SaaS offerings. This repository is an example application. Be aware that neither the john-stack nor the example application is fully fleshed out. I'm just hosting it here to make it easier to show people the cool things in it.

## quickstart

1. clone the repo to a linux environment
2. ensure you have these tools installed on your system

   - podman
   - podman-compose
   - npm
   - node (probably any version that supports `--env-file`)

3. run `npm i` to install required npm packages
4. start local versions of the dependency services with `npm run deps:start`
5. set up the app and insert seed data with `npm run seed`
6. start the api service with `npm run api:start`
7. start the browser app with `npm run client:start`
8. open the browser app at `http://localhost:5002`
9. one test user is `john@john-stack-co.com` with default password `Password1!`

## definitions

the **application** or **app**: the whole thing together

**dependency services** or **deps**: third-party services the app relies on, but whose source code doesn't live in this repo (e.g. postgres or zitadel)

**application components** or **app components**: each part of the app whose source code does live in this repo (e.g. the api service or the browser app)

## config

[the app's config is stored in the environment](https://12factor.net/config).
there is a `config.ts` file that defines the required variables.
in an arbitrary deployment, the app can build/run as long as these variables are in the environment, regardless of how they get there.
but, our development scripts use `.env` files. `.env.static` holds some, and a generated file, `.env.seed`, holds some more.

## ports

right now, development ports are hardcoded as follows. i'd like to find a nice way to make these variables.

| service     | port |
| ----------- | ---- |
| postgres    | 5000 |
| api service | 5001 |
| browser app | 5002 |
| zitadel     | 5003 |

## development notes

- live updates on save should work as expected
- if you clean and reseed the dependency services, you'll have to manually restart the app components
- look in `seed-idp.tf` for `"zitadel_human_user"`s for credentials to auto-created test users

## it's called the john-stack, so what's the stack?

- **typescript** as the language of choice (and the default **tsc** compiler for type-checking)
- **react** for frontend browser apps
- plain old **node** can run backend services
- **effect** as the standard library extension of choice
- **postgresql** for relational databases
- **zitadel** as the identity service, so you don't have to roll your own
- **fununit**, a home-rolled unit testing library, for writing and running unit tests
- **eslint** for lint rule enforcement
- **prettier** for opinionated formatting
- plain old **npm** can handle package management and running scripts
- **esbuild**, **tsx**, **vite**, **bash**, **terraform**, **podman** all help with dev servers and building

cool, what about other characteristics?

- monorepo
- change watching (and hot reloading where possible) for all app components and without intermediate build steps
- seamless typescript autocomplete between and among all source files
- type-safe database queries
- type-safe environment variables for configuration
- type-safe client-server communication
- an absolutely beautiful RPC-style client-server communication model (you won't have to write REST code ever again)
- backend api architecture that is agnostic of deployment type: supports serverless and serverful deployments
- a wonderful, simple, sane approach to writing AND running unit tests
- it's all "just typescript," no code generation or weird dynamic stuff
- sensible npm scripts
- no bloat or boilerplate
- adheres closely to the [twelve-factor methodology](https://12factor.net/)
