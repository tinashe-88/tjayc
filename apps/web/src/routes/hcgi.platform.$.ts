/**
 * The browser PocketBase client calls `/hcgi/platform/*`. In production the
 * platform proxy owns that path. In this preview those requests reach the app
 * and 404, which left videos and tracks stuck loading. Forward them to the
 * local PocketBase instance so the public client keeps working.
 */
const HOP_BY_HOP = new Set([
	'connection',
	'keep-alive',
	'proxy-authenticate',
	'proxy-authorization',
	'te',
	'trailers',
	'transfer-encoding',
	'upgrade',
	'host',
	'content-length',
	'content-encoding',
]);

type ProxyArgs = {
	request: Request;
	params: Record<string, string | undefined>;
};

async function proxyPocketBase({ request, params }: ProxyArgs) {
	const incoming = new URL(request.url);
	const suffix = params['*'] ?? '';
	const origin = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
	const target = new URL(`/${suffix}${incoming.search}`, origin);

	const headers = new Headers();
	request.headers.forEach((value, key) => {
		if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value);
	});

	const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
	try {
		const upstream = await fetch(target, {
			method: request.method,
			headers,
			body: hasBody ? await request.arrayBuffer() : undefined,
			redirect: 'manual',
		});

		const responseHeaders = new Headers();
		upstream.headers.forEach((value, key) => {
			if (!HOP_BY_HOP.has(key.toLowerCase())) responseHeaders.set(key, value);
		});

		return new Response(upstream.body, {
			status: upstream.status,
			statusText: upstream.statusText,
			headers: responseHeaders,
		});
	} catch {
		return new Response(JSON.stringify({ message: 'PocketBase unavailable' }), {
			status: 502,
			headers: { 'content-type': 'application/json' },
		});
	}
}

export const loader = proxyPocketBase;
export const action = proxyPocketBase;
