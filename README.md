# cf-service-vector

A Cloudflare Workers implementation of the Cloudflare Vectorize API to be used as a Service Binding from Cloudflare Pages Functions (since it's not yet supported: https://developers.cloudflare.com/pages/functions/bindings/)

## Install

```bash
nvm use && pnpm install
```

## Create a Vectorize Index

```bash
npx wrangler vectorize create test-dev --dimensions=3 --metric=cosine
```

## Run (in Dev Mode)

```bash
# vectorize does not run locally, use "remote"
npx wrangler dev --remote
```

## Test


https://developers.cloudflare.com/vectorize/reference/client-api/#insert-vectors
```bash
curl -X POST -H "Content-Type: application/json" -d @test/insert.json "http://localhost:8787/insert"
```

https://developers.cloudflare.com/vectorize/reference/client-api/#upsert-vectors
```bash
curl -X POST -H "Content-Type: application/json" -d @test/upsert.json "http://localhost:8787/upsert"
```

https://developers.cloudflare.com/vectorize/reference/client-api/#query-vectors
```bash
curl -X POST -H "Content-Type: application/json" -d @test/query.json "http://localhost:8787/query"
```
```bash
curl -X POST -H "Content-Type: application/json" -d @test/query_filter.json "http://localhost:8787/query"
```
```bash
curl -X POST -H "Content-Type: application/json" -d @test/query_not.json "http://localhost:8787/query"
```

https://developers.cloudflare.com/vectorize/reference/client-api/#get-vectors-by-id
```bash
curl -X POST -H "Content-Type: application/json" -d @test/getByIds.json "http://localhost:8787/get-by-ids"
```

https://developers.cloudflare.com/vectorize/reference/client-api/#delete-vectors-by-id
```bash
curl -X POST -H "Content-Type: application/json" -d @test/deleteByIds.json "http://localhost:8787/delete-by-ids"
```

https://developers.cloudflare.com/vectorize/reference/client-api/#retrieve-index-details
```bash
curl "http://localhost:8787/describe"
```

## Deploy

```bash
# deploy worker per "dev" (default) environment config
npx wrangler deploy
```

```bash
# deploy worker per "production" env config (this creates a distinct worker instance named: "cf-service-worker-production")
npx wrangler deploy --env production
```

## Configure (for use with Cloudflare Pages Functions)

### Local

https://developers.cloudflare.com/pages/functions/bindings/#interact-with-your-service-bindings-locally
```bash
npx wrangler pages dev <OUTPUT_DIR> --service CF_SERVICE_VECTOR=cf-service-vector
```

### Remote

https://developers.cloudflare.com/pages/functions/bindings/#service-bindings

## Use (in Cloudflare Pages Functions code)

```javascript
const res = await env.CF_SERVICE_VECTOR.fetch("https://mydomain.com/query, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    values: [0.27, 0.19, 0.48],
    topK: 2
  })
});
```
