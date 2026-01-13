# ArdaGraph Deployment Guide (Railway)

This guide walks you through deploying ArdaGraph to Railway.

## Prerequisites

- Railway account (https://railway.app)
- GitHub repository with the ArdaGraph code
- Railway CLI (optional, for local development)

## Step 1: Deploy Neo4j

1. **Go to Railway Dashboard**
   - Visit https://railway.app and sign in
   - Create a new project

2. **Add Neo4j Service**
   - Click "+ New Service"
   - Search for "Neo4j" in the template marketplace
   - Select "Neo4j Community Edition"
   - Railway will provision a Neo4j instance

3. **Note the Connection Details**
   - Click on the Neo4j service
   - Go to "Variables" tab
   - Note down:
     - `NEO4J_URI` (e.g., `neo4j://neo4j.railway.internal:7687`)
     - `NEO4J_USER` (usually `neo4j`)
     - `NEO4J_PASSWORD` (auto-generated)

4. **Initialize Schema** (after deployment)
   - You'll run the ingestion script locally targeting Railway Neo4j
   - Or create a one-time Railway service to run the ingestion

## Step 2: Deploy GraphQL API

1. **Add New Service**
   - In your Railway project, click "+ New Service"
   - Select "GitHub Repo"
   - Connect your ArdaGraph repository
   - Select the repository

2. **Configure API Service**
   - Railway should auto-detect the monorepo
   - Set the root directory: `apps/api`
   - Or use the `railway.toml` configuration

3. **Set Environment Variables**
   - Go to the API service → "Variables" tab
   - Add these variables:
     ```
     NEO4J_URI=${{Neo4j.NEO4J_URI}}
     NEO4J_USER=${{Neo4j.NEO4J_USER}}
     NEO4J_PASSWORD=${{Neo4j.NEO4J_PASSWORD}}
     PORT=4000
     NODE_ENV=production
     ```
   - Railway's variable referencing (`${{ServiceName.VARIABLE}}`) will automatically link services

4. **Deploy**
   - Railway will automatically build and deploy
   - Note the public URL (e.g., `https://api-production-xxxx.up.railway.app`)

## Step 3: Deploy Next.js Web App

1. **Add New Service**
   - Click "+ New Service"
   - Select the same GitHub repository
   - This creates another service from the same repo

2. **Configure Web Service**
   - Set root directory: `apps/web`
   - Or use the `railway.toml` configuration

3. **Set Environment Variables**
   - Go to the Web service → "Variables" tab
   - Add:
     ```
     NEXT_PUBLIC_API_URL=${{API.RAILWAY_PUBLIC_URL}}/graphql
     NODE_ENV=production
     ```

4. **Deploy**
   - Railway will build and deploy Next.js
   - Note the public URL for your web app

5. **Optional: Add Custom Domain**
   - Go to Web service → "Settings" → "Domains"
   - Click "Generate Domain" or add your custom domain

## Step 4: Load Seed Data

You have three options to load data into Railway Neo4j:

### Option A: Run Locally (Recommended for MVP)

1. **Update local `.env` file**
   ```env
   NEO4J_URI=<Railway Neo4j URI>
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=<Railway password>
   ```

2. **Run ingestion**
   ```bash
   cd /path/to/ArdaGraph
   pnpm ingest
   ```

### Option B: Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and link project**
   ```bash
   railway login
   railway link
   ```

3. **Run ingestion with Railway environment**
   ```bash
   railway run pnpm ingest
   ```

### Option C: Create Ingestion Service (One-time)

1. Add a new service from your repo
2. Set root directory: `scripts/ingest`
3. Configure same NEO4J_* variables
4. Deploy (runs once)
5. Delete service after completion

## Step 5: Verify Deployment

1. **Test API**
   - Visit `https://your-api-url.railway.app/health`
   - Should return `{"status":"ok"}`
   - Test GraphQL at `https://your-api-url.railway.app/graphql`

2. **Test Web App**
   - Visit your web app URL
   - Try searching for "Gandalf"
   - Click on an entity to view details
   - Verify graph visualization loads

3. **Check Logs**
   - In Railway dashboard, click on each service
   - Go to "Deployments" → View logs
   - Ensure no errors

## Troubleshooting

### API Can't Connect to Neo4j

- Check that NEO4J_URI uses Railway's internal networking
- Should be `neo4j://neo4j.railway.internal:7687` (not the public URL)
- Verify environment variables are set correctly

### Web App Can't Reach API

- Ensure `NEXT_PUBLIC_API_URL` is set
- Should be the public API URL with `/graphql` path
- Check CORS is enabled in API (it's configured in `apps/api/src/index.ts`)

### Build Failures

- Check Railway build logs
- Ensure `pnpm-workspace.yaml` is in root
- Verify all dependencies are in `package.json` files
- Try: Settings → "Reset Build Cache"

### No Data in Web App

- Run the ingestion script (Step 4)
- Check Neo4j has data: Railway Neo4j service → Connect → Browser
- Run Cypher query: `MATCH (n) RETURN count(n)`

## Environment Variables Reference

### Neo4j Service
- `NEO4J_URI` - Connection URI
- `NEO4J_USER` - Username (usually `neo4j`)
- `NEO4J_PASSWORD` - Password

### API Service
- `NEO4J_URI` - From Neo4j service
- `NEO4J_USER` - From Neo4j service
- `NEO4J_PASSWORD` - From Neo4j service
- `PORT` - API port (4000)
- `NODE_ENV` - `production`

### Web Service
- `NEXT_PUBLIC_API_URL` - Public API URL with `/graphql`
- `NODE_ENV` - `production`

## Cost Estimate

Railway Pricing (as of 2026):
- **Hobby Plan**: $5/month per service
- **Estimated Monthly Cost**: $15-20/month
  - Neo4j: $5
  - API: $5
  - Web: $5

Free tier includes $5 credit/month (good for prototyping).

## Next Steps After Deployment

1. **Add more data** - Expand seed data with more entities
2. **Custom domain** - Add your own domain in Railway
3. **Monitoring** - Set up Railway alerts for service health
4. **Backups** - Set up Neo4j backup strategy
5. **CI/CD** - Configure automatic deployments on git push

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Neo4j Docs: https://neo4j.com/docs

