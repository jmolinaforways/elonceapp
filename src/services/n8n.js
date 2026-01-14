export const N8N_BASE_URL = "https://n8n.forways.com.do/webhook";

/**
 * Interact with N8N Endpoints
 * @param {string} endpoint - The specific webhook path or full URL
 * @param {object} payload - Data to send (body for POST, query params for GET)
 * @param {string} method - HTTP method ('POST' | 'GET')
 */
export const callN8N = async (endpoint, payload = {}, method = 'POST') => {
    try {
        let url = endpoint.startsWith('http') ? endpoint : `${N8N_BASE_URL}/${endpoint}`;

        // Get user info from local storage to include in every request
        const userStr = localStorage.getItem('user');
        let enrichedPayload = { ...payload };

        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.email) enrichedPayload.email = user.email;
                if (user.name) enrichedPayload.name = user.name;
            } catch (e) {
                console.error("Error parsing user from storage", e);
            }
        }

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (method === 'GET') {
            const queryParams = new URLSearchParams(enrichedPayload).toString();
            if (queryParams) {
                url += `?${queryParams}`;
            }
        } else {
            options.body = JSON.stringify(enrichedPayload);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("N8N Interaction Failed:", error);
        throw error;
    }
}
