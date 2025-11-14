export const handler = async (event) => {
    const token = event.queryStringParameters.token;
    
    try {
        const response = await fetch(`https://admin.kuppo.net/getData.php?token=${token}`);
        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'API hatası' })
        };
    }
};
