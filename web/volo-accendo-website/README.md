# Volo Accendo Website

A Next.js application with Lambda@Edge server-side rendering for cost-effective hosting.

## Project Structure

```
volo-accendo-website/
├── app/                 # Next.js app directory (pages and components)
├── public/             # Static assets
├── lambdas/            # Lambda@Edge functions
├── .lambdas/           # Compiled Lambda functions
├── __mocks__/          # Jest test mocks
├── doc/                # Documentation
└── [config files]      # Various configuration files
```

## Tech Stack

- Next.js 15.1.2
- React 19
- TypeScript
- TailwindCSS + DaisyUI
- Jest for testing
- MDX for content

## Environment Setup

The project uses different environment configurations for development and production:

- `.env.dev` - Development environment variables
- `.env.prod` - Production environment variables

Environment variables are loaded in the following order:

1. `.env.development.local` or `.env.production.local`
2. `.env.local`
3. `.env.development` or `.env.production`
4. `.env`

## Development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start development server:

   ```bash
   pnpm dev
   ```

3. Run tests:
   ```bash
   pnpm test
   ```

## Building

### Development Build

```bash
pnpm build:dev
```

### Production Build

```bash
pnpm build:prod
```

The build process:

1. Copies the appropriate environment file (`.env.dev` or `.env.prod`) to `.env`
2. Builds the Next.js application
3. Compiles Lambda@Edge functions
4. Copies necessary files for deployment

## Deployment

The application is deployed using GitHub Actions workflows. The build process creates:

- A standalone Next.js application
- Lambda@Edge functions for server-side rendering
- Required static assets and configurations

## Additional Documentation

For more detailed build and deployment information, see [BUILD.md](./BUILD.md).
