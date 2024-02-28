import { parseRequestBody } from "./utils";

const handleUpsert = async (request, env, ctx) => {
	const data = await parseRequestBody(request);
	const upserted = await env.VECTORIZE_INDEX.upsert(data);
	return Response.json(upserted);
};

const handleInsert = async (request, env, ctx) => {
	const data = await parseRequestBody(request);
	const inserted = await env.VECTORIZE_INDEX.insert(data);
	return Response.json(inserted);
};

const handleQuery = async (request, env, ctx) => {
	const data = await parseRequestBody(request);
	if (!data?.values) {
		return new Response("Bad Request", { status: 400 });
	};
	const queryVector = data.values;
	const topK = data.topK || 3;
	const filter = data?.filter;
	const returnValues = data.returnValues || true;
	const returnMetadata = data.returnMetadata || true;
	const options = {
		topK,
		returnValues,
		returnMetadata
	};
	if (filter) {
		queryOptions["filter"] = filter;
	};
	const matches = await env.VECTORIZE_INDEX.query(queryVector, options);
	return Response.json({ matches });
};

const handleGetByIds = async (request, env, ctx) => {
	const data = await parseRequestBody(request);
	if (!data?.ids) {
		return new Response("Bad Request", { status: 400 });
	};
	const ids = data.ids;
	const returnValues = data.returnValues || true;
	const returnMetadata = data.returnMetadata || true;
	const options = {
		returnValues,
		returnMetadata
	};
	const matches = await env.VECTORIZE_INDEX.getByIds(ids, options);
	return Response.json(matches);
};

const handleDeleteByIds = async (request, env, ctx) => {
	const data = await parseRequestBody(request);
	if (!data?.ids) {
		return new Response("Bad Request", { status: 400 });
	};
	const ids = data.ids;
	const deleted = await env.VECTORIZE_INDEX.deleteByIds(ids);
	return Response.json(deleted);
};

const handleDescribe = async (request, env, ctx) => {
	const details = await env.VECTORIZE_INDEX.describe();
	return Response.json(details);
};

// see: https://developers.cloudflare.com/vectorize/reference/client-api/
const handlePost = async (request, env, ctx) => {
	const path = new URL(request.url).pathname;
	switch (path) {
		case "/insert":
			return handleInsert(request, env, ctx);
		case "/upsert":
			return handleUpsert(request, env, ctx);
		case "/query":
			return handleQuery(request, env, ctx);
		case "/get-by-ids":
			return handleGetByIds(request, env, ctx);
		case "/delete-by-ids":
			return handleDeleteByIds(request, env, ctx);
		default:
			return new Response("Not Found", { status: 404 });
	};
};

const handleGet = async (request, env, ctx) => {
	const path = new URL(request.url).pathname;
	switch (path) {
		case "/describe":
			return handleDescribe(request, env, ctx);
		default:
			return new Response("Not Found", { status: 404 });
	};
};

export default {
	async fetch(request, env, ctx) {
		const method = request.method;
		switch (method) {
			case "POST":
				return handlePost(request, env, ctx);
			case "GET":
				return handleGet(request, env, ctx);
			default:
				return new Response("Method Not Allowed", { status: 405 });
		};
	}
};