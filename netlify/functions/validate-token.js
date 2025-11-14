exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Token parametresini al
    const { token } = event.queryStringParameters;
    
    console.log('🔐 Token doğrulanıyor:', token);
    
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

    // Token formatını kontrol et
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

    // ✅ GERÇEK API'YI BURADA ÇAĞIRIYORUZ
    const apiUrl = `https://admin.kuppo.net/getData.php?token=${encodeURIComponent(token)}`;
    console.log('🌐 API çağrısı:', apiUrl);
    
    const apiResponse = await fetch(apiUrl);
    const apiData = await apiResponse.text();
    
    console.log('📡 API cevabı:', apiData);

    // API cevabını parse et ve doğrula
    // Bu kısmı API'nın döndüğü formata göre ayarlayın
    const isValid = apiData.includes('success') || apiData.includes('true') || !apiData.includes('error');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        status: isValid,
        message: isValid ? 'Token is valid' : 'Invalid token',
        apiResponse: apiData // Debug için
      })
    };

  } catch (error) {
    console.error('❌ Error:', error);
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
