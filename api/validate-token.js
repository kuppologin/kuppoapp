export default async function handler(request, response) {
    // CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS request için
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    // Sadece GET methoduna izin ver
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { token } = request.query;

        // Token validation
        if (!token) {
            return response.status(400).json({ 
                status: false, 
                error: 'Token is required' 
            });
        }

        // Token format kontrolü
        if (!token.startsWith('yx-') && !token.startsWith('ty-')) {
            return response.status(400).json({ 
                status: false, 
                error: 'Invalid token format' 
            });
        }

        // TOKEN DOĞRULAMA LOGIC'İ BURAYA GELECEK
        // Şu anlık her token'i geçerli kabul ediyoruz
        const isValid = await validateTokenLogic(token);

        return response.status(200).json({
            status: isValid,
            token: token,
            timestamp: new Date().toISOString(),
            message: isValid ? 'Token geçerli' : 'Token geçersiz'
        });

    } catch (error) {
        console.error('Token validation error:', error);
        return response.status(500).json({ 
            status: false, 
            error: 'Internal server error' 
        });
    }
}

// GERÇEK TOKEN DOĞRULAMA FONKSİYONU
// Burayı kendi backend servisine bağlayacaksın
async function validateTokenLogic(token) {
    try {
        // Örnek doğrulama - GERÇEK İMPLEMENTASYONDA DEĞİŞTİR
        if (token.startsWith('yx-') || token.startsWith('ty-')) {
            // Token uzunluk kontrolü
            if (token.length >= 10 && token.length <= 50) {
                // Burada gerçek validation yapılacak
                // Örnek: Database sorgusu, API call vs.
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Token validation logic error:', error);
        return false;
    }
}
