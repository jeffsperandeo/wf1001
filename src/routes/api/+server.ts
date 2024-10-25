import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    return new Response(JSON.stringify({ 
			app: 'Worxflow',
			version: '0.0.1',
			message: 'Hello World' 
		}), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
