import { Router } from "itty-router";
const router = Router();

export interface Env {
  SHORTENER_NAMESPACE: KVNamespace; // the KV namespace we setup in the previous step
  HOST_URL: string;
}

router.post("/", async (request: Request, env: Env) => {
    // Parse the JSON body of the request to extract the long URL
    const json = await request.json();
    const longLink = json?.url;
  
    // Generate a random slug for the shortened URL
    let slug = generateRandomSlug();
  
    // Check if the slug already exists in the KV store
    let existing = await env.SHORTENER_KV.get(slug);
    
    // Keep generating new slugs until we find one that doesn't exist
    while (existing) {
      slug = generateRandomSlug();
      existing = await env.SHORTENER_KV.get(slug);
    }
  
    // Store the long URL in the KV store with the generated slug as the key
    await env.SHORTENER_KV.put(slug, longLink);
  
    // Construct the shortened URL using the HOST_URL and the generated slug
    const shortenedUrl = `${env.HOST_URL}/${slug}`;
  
    // Return the shortened URL as a JSON response
    return new Response(JSON.stringify({ url: shortenedUrl }), {
      headers: { "content-type": "application/json" },
    });
  });
  

  router.get("/:slug", async (request: Request, env: Env) => {
    const slug = request.params.slug;
    const redirectTo = await env.SHORTENER_KV.get(slug);
    if (redirectTo) {
      return Response.redirect(redirectTo, 302);
    }
    return new Response("URL not found", {
      status: 404,
    });
  });

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return router.handle(request, env, ctx).then((res: Response) => {
      console.log("HTTP Response", request.url, res.status);
      return res;
    });
  },
};
function generateRandomSlug() {
    // Generate a random string of characters to use as a slug
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let slug = "";
    for (let i = 0; i < 9; i++) {
      slug += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return slug;
  }
 
