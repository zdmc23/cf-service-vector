/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
const readRequestBody = async(request) => {
  const { headers } = request;
  const contentType = headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return JSON.stringify(await request.json());
  } else if (contentType.includes('application/text')) {
    return request.text();
  } else if (contentType.includes('text/html')) {
    return request.text();
  } else if (contentType.includes('form')) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    };
    return JSON.stringify(body);
  } else {
    return null;
  }
};

/**
 * Safely parse request body
 * @param {Request} request 
 * @returns request body as object
 */
export const parseRequestBody = async(request) => {
  const reqBodyStr = await readRequestBody(request);
  return JSON.parse(reqBodyStr);
};