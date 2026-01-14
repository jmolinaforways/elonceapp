export default async function handler(request, response) {
    const { url } = request.query;

    if (!url) {
        return response.status(400).send('Missing URL parameter');
    }

    try {
        // Determine the actual URL to fetch
        // If it's a Drive view link, convert to download/export link
        let fetchUrl = url;
        const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (driveMatch && driveMatch[1]) {
            fetchUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
        }

        const imageResponse = await fetch(fetchUrl);

        if (!imageResponse.ok) {
            return response.status(imageResponse.status).send('Failed to fetch image');
        }

        const arrayBuffer = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Forward the content type (e.g., image/jpeg)
        const contentType = imageResponse.headers.get('content-type');
        if (contentType) {
            response.setHeader('Content-Type', contentType);
        }

        // Cache for performance
        response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

        response.send(buffer);
    } catch (error) {
        console.error('Proxy Error:', error);
        response.status(500).send('Internal Server Error');
    }
}
