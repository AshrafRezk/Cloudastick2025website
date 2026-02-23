/**
 * Certificate Viewer Component
 * Renders the certificate template with branding
 */

import { Certificate } from '../services/learningService';

interface CertificateViewerProps {
  certificate: Certificate;
  showVerificationCode?: boolean;
}

const CertificateViewer = ({ certificate, showVerificationCode = true }: CertificateViewerProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="certificate-container bg-white" style={{
      width: '210mm',
      minHeight: '297mm',
      margin: '0 auto',
      padding: '40px',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      position: 'relative',
    }}>
      {/* Decorative border */}
      <div className="absolute inset-0 border-8 border-yellow-400" style={{
        borderImage: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706) 1',
      }}></div>

      {/* Header with logos */}
      <div className="flex justify-between items-center mb-8">
        {/* Cloudastick Logo */}
        <div className="flex-1">
          <img
            src="/Assets/Company Logos/blue-logo.png"
            alt="Cloudastick"
            className="h-16 object-contain"
          />
        </div>
      </div>

      {/* Certificate Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-4" style={{
          fontFamily: 'serif',
          letterSpacing: '2px',
        }}>
          Certificate of Completion
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto"></div>
      </div>

      {/* Course Logo (below title) */}
      <div className="text-center mb-10 flex flex-col items-center gap-4">
        {certificate.certificateLogoUrl && (
          <img
            src={certificate.certificateLogoUrl}
            alt="Course Logo"
            className="max-h-24 object-contain"
          />
        )}
      </div>

      {/* Certificate Body */}
      <div className="text-center mb-12">
        <p className="text-lg text-gray-700 mb-6" style={{ lineHeight: '1.8' }}>
          This is to certify that
        </p>
        <h2 className="text-4xl font-bold text-gray-900 mb-6" style={{
          fontFamily: 'serif',
          textDecoration: 'underline',
          textDecorationColor: '#fbbf24',
          textDecorationThickness: '3px',
        }}>
          {certificate.contactName}
        </h2>
        <p className="text-lg text-gray-700 mb-6" style={{ lineHeight: '1.8' }}>
          has successfully completed the course
        </p>
        <h3 className="text-3xl font-semibold text-gray-800 mb-8" style={{
          fontFamily: 'serif',
        }}>
          {certificate.learningMaterialTitle}
        </h3>
        <p className="text-base text-gray-600 mb-4">
          Issued on {formatDate(certificate.issuedDate)}
        </p>

        {certificate.learningMaterialDescription && (
          <p className="text-sm text-gray-500 max-w-lg mx-auto italic leading-relaxed">
            {certificate.learningMaterialDescription}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-20 left-0 right-0">
        <div className="flex justify-between items-end px-12">
          {/* Certificate ID */}
          <div className="text-[10px] text-gray-400">
            <div>Certificate ID: {certificate.certificateId}</div>
            {showVerificationCode && (
              <div>Verification Code: {certificate.verificationCode}</div>
            )}
          </div>

          {/* Signature area */}
          <div className="text-center flex flex-col items-center">
            <div className="relative mb-0 h-16 w-48 flex items-center justify-center">
              <img
                src="/Assets/LMS%20assets/signature.png"
                alt="Authorized Signature"
                className="max-h-full max-w-full object-contain mix-blend-multiply"
                onError={(e) => {
                  console.error('Failed to load signature. Trying alternative path.');
                  (e.target as HTMLImageElement).src = '/Assets/LMS assets/signature.png';
                }}
              />
            </div>
            <div className="border-t-2 border-gray-400 w-48"></div>
            <div className="text-sm text-gray-600 mt-2 font-medium">Authorized Signature</div>
          </div>
        </div>
      </div>

      {/* Watermark (optional) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="text-9xl font-bold text-gray-300 transform -rotate-45">
          Cloudastick
        </div>
      </div>
    </div>
  );
};

export default CertificateViewer;

