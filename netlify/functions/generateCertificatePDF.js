/**
 * Netlify Function to generate PDF version of a certificate
 * Uses Puppeteer or similar to render HTML certificate to PDF
 */

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('📄 Generate Certificate PDF - Request received');

    const { certificateId } = JSON.parse(event.body || '{}');

    if (!certificateId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing certificate ID',
          message: 'certificateId is required',
        }),
      };
    }

    // Get certificate data
    const getCertUrl = `${event.headers.host || 'localhost'}/.netlify/functions/getCertificate`;
    const certResponse = await fetch(getCertUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ certificateId }),
    });

    if (!certResponse.ok) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Certificate not found',
        }),
      };
    }

    const certData = await certResponse.json();
    const certificate = certData.certificate;

    // For now, return a simple response indicating PDF generation
    // In production, you would use Puppeteer or similar to generate PDF
    // This is a placeholder that can be enhanced with actual PDF generation
    
    // Option 1: Use Puppeteer (requires @sparticus/chromium or similar in Netlify)
    // Option 2: Use a PDF service API
    // Option 3: Return HTML that can be printed to PDF on the client side
    
    // For now, we'll return a message indicating the certificate URL
    // The frontend can use window.print() as a fallback
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'PDF generation not yet implemented. Use print functionality in browser.',
        certificateUrl: certificate.certificateUrl,
      }),
    };

    /* 
    // Example Puppeteer implementation (requires puppeteer-core and @sparticus/chromium):
    const puppeteer = require('puppeteer-core');
    const chromium = require('@sparticus/chromium');
    
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    
    const page = await browser.newPage();
    await page.setContent(certificateHtml, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    
    await browser.close();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${certificateId}.pdf"`,
      },
      body: pdf.toString('base64'),
      isBase64Encoded: true,
    };
    */
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};

