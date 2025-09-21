/**
 * Email Templates for PosterAI Platform
 * Contains HTML and text templates for various email types
 */

class EmailTemplates {
  /**
   * Create HTML template for order confirmation email
   * @param {Object} data - Email data
   * @returns {string} HTML template
   */
  static createOrderConfirmationHTML(data) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Potwierdzenie zamówienia</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1E3A8A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .poster-preview { text-align: center; margin: 20px 0; }
        .poster-preview img { max-width: 200px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .info-label { font-weight: bold; }
        .total { font-size: 18px; font-weight: bold; color: #1E3A8A; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .button { background: #1E3A8A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Potwierdzenie zamówienia</h1>
            <p>Dziękujemy za zamówienie!</p>
        </div>
        
        <div class="content">
            <p>Cześć ${data.customerName}!</p>
            <p>Twoje zamówienie zostało przyjęte i jest w trakcie przetwarzania. Oto szczegóły:</p>
            
            <div class="order-info">
                <h3>📋 Szczegóły zamówienia</h3>
                <div class="info-row">
                    <span class="info-label">Numer zamówienia:</span>
                    <span>#${data.orderId}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Data zamówienia:</span>
                    <span>${data.orderDate}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Rozmiar:</span>
                    <span>${data.posterSize}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Wykończenie:</span>
                    <span>${data.posterFinish}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Kwota:</span>
                    <span>${data.amount} ${data.currency}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Szacowana dostawa:</span>
                    <span>${data.estimatedDelivery}</span>
                </div>
            </div>

            ${data.posterImage ? `
            <div class="poster-preview">
                <h3>🖼️ Podgląd plakatu</h3>
                <img src="${data.posterImage}" alt="Podgląd plakatu" />
            </div>
            ` : ''}

            <div class="order-info">
                <h3>🚚 Adres dostawy</h3>
                <p>
                    ${data.shippingAddress.name || 'Klient'}<br>
                    ${data.shippingAddress.address || data.shippingAddress.line1}<br>
                    ${data.shippingAddress.line2 ? data.shippingAddress.line2 + '<br>' : ''}
                    ${data.shippingAddress.postalCode} ${data.shippingAddress.city}<br>
                    ${data.shippingAddress.countryCode || 'Polska'}
                </p>
            </div>

            <div style="text-align: center;">
                <a href="#" class="button">Śledź zamówienie</a>
            </div>

            <p><strong>Co dalej?</strong></p>
            <ul>
                <li>Twoje zamówienie zostanie przetworzone w ciągu 1-2 dni roboczych</li>
                <li>Otrzymasz email z potwierdzeniem płatności</li>
                <li>Wyślemy Ci email gdy plakat zostanie wysłany</li>
                <li>Możesz śledzić status zamówienia w swoim koncie</li>
            </ul>

            <p>Jeśli masz pytania, skontaktuj się z nami pod adresem: <a href="mailto:support@posterai.pl">support@posterai.pl</a></p>
        </div>

        <div class="footer">
            <p>Dziękujemy za wybór naszej platformy!</p>
            <p>PosterAI Platform</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Create text version of order confirmation email
   * @param {Object} data - Email data
   * @returns {string} Text version
   */
  static createOrderConfirmationText(data) {
    return `
Potwierdzenie zamówienia #${data.orderId}

Cześć ${data.customerName}!

Twoje zamówienie zostało przyjęte i jest w trakcie przetwarzania.

Szczegóły zamówienia:
- Numer zamówienia: #${data.orderId}
- Data zamówienia: ${data.orderDate}
- Rozmiar: ${data.posterSize}
- Wykończenie: ${data.posterFinish}
- Kwota: ${data.amount} ${data.currency}
- Szacowana dostawa: ${data.estimatedDelivery}

Adres dostawy:
${data.shippingAddress.name || 'Klient'}
${data.shippingAddress.address || data.shippingAddress.line1}
${data.shippingAddress.line2 ? data.shippingAddress.line2 : ''}
${data.shippingAddress.postalCode} ${data.shippingAddress.city}
${data.shippingAddress.countryCode || 'Polska'}

Co dalej?
- Twoje zamówienie zostanie przetworzone w ciągu 1-2 dni roboczych
- Otrzymasz email z potwierdzeniem płatności
- Wyślemy Ci email gdy plakat zostanie wysłany
- Możesz śledzić status zamówienia w swoim koncie

Jeśli masz pytania, skontaktuj się z nami: support@posterai.pl

Dziękujemy za wybór naszej platformy!
PosterAI Platform
`;
  }

  /**
   * Create HTML template for order status update email
   * @param {Object} data - Email data
   * @returns {string} HTML template
   */
  static createOrderStatusUpdateHTML(data) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Status zamówienia</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0D9488; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .status-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; }
        .status-in-production { background: #FBBF24; color: #92400E; }
        .status-shipped { background: #10B981; color: white; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 Aktualizacja statusu zamówienia</h1>
        </div>
        
        <div class="content">
            <p>Cześć ${data.customerName}!</p>
            <p>Mamy aktualizację dotyczącą Twojego zamówienia #${data.orderId}:</p>
            
            <div class="status-info">
                <h3>Status zamówienia</h3>
                <span class="status-badge status-${data.status}">${this.getStatusText(data.status)}</span>
                <p><strong>Data aktualizacji:</strong> ${data.updateDate}</p>
                
                ${data.trackingNumber ? `
                <p><strong>Numer śledzenia:</strong> ${data.trackingNumber}</p>
                ` : ''}
                
                ${data.estimatedDelivery ? `
                <p><strong>Szacowana dostawa:</strong> ${data.estimatedDelivery}</p>
                ` : ''}
            </div>

            <p>Możesz śledzić status swojego zamówienia w swoim koncie lub skontaktować się z nami pod adresem: <a href="mailto:support@posterai.pl">support@posterai.pl</a></p>
        </div>

        <div class="footer">
            <p>Dziękujemy za wybór naszej platformy!</p>
            <p>PosterAI Platform</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Get status text in Polish
   * @param {string} status - Status code
   * @returns {string} Status text
   */
  static getStatusText(status) {
    const statusMap = {
      'in_production': 'W produkcji',
      'shipped': 'Wysłane',
      'delivered': 'Dostarczone',
      'cancelled': 'Anulowane'
    };
    return statusMap[status] || status;
  }
}

module.exports = EmailTemplates;
