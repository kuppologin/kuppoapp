export default async function handler(request, response) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    try {
        const { token } = request.query;

        if (!token) {
            return response.status(400).json({ 
                status: false, 
                message: 'Token parameter is required' 
            });
        }

        if (!token.startsWith('yx-') && !token.startsWith('ty-')) {
            return response.status(200).json({ 
                status: false, 
                message: 'Invalid token format' 
            });
        }

        let apiUrl;
        
        if (token.startsWith('yx-')) {
            apiUrl = `https://admin.kuppo.net/getData.php?token=${encodeURIComponent(token)}`;
        } else if (token.startsWith('ty-')) {
            apiUrl = `https://admin.kuppo.net/getCookie.php?token=${encodeURIComponent(token)}&all=1`;
        }
        
        const apiResponse = await fetch(apiUrl);
        
        if (!apiResponse.ok) {
            throw new Error(`API error: ${apiResponse.status}`);
        }
        
        const apiData = await apiResponse.json();

        const isValid = apiData.status === true;
        
        return response.status(200).json({ 
            status: isValid,
            message: isValid ? 'Token is valid' : 'Invalid token'
        });

    } catch (error) {
        return response.status(500).json({ 
            status: false, 
            message: 'Internal server error: ' + error.message 
        });
    }
}
