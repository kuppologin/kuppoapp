exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { token } = event.queryStringParameters;
    
    console.log('Token doğrulanıyor:', token);
    
    if (!token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          status: false, 
          message: 'Token parameter is required' 
        })
      };
    }

    if (!token.startsWith('yx-') && !token.startsWith('ty-')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          status: false, 
          message: 'Invalid token format' 
        })
      };
    }

    let apiUrl;
    
    if (token.startsWith('yx-')) {
      apiUrl = `https://admin.kuppo.net/getData.php?token=${encodeURIComponent(token)}`;
    } else if (token.startsWith('ty-')) {
      apiUrl = `https://admin.kuppo.net/getCookie.php?token=${encodeURIComponent(token)}&all=1`;
    }
    
    console.log('API çağrısı:', apiUrl);
    
    const apiResponse = await fetch(apiUrl);
    
    if (!apiResponse.ok) {
      throw new Error(`API error: ${apiResponse.status}`);
    }
    
    const apiData = await apiResponse.json();
    console.log('API cevabı:', apiData);

    const isValid = apiData.status === true;

    console.log('Token geçerli mi?:', isValid);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        status: isValid,
        message: isValid ? 'Token is valid' : 'Invalid token'
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        status: false, 
        message: 'Internal server error: ' + error.message 
      })
    };
  }
};
