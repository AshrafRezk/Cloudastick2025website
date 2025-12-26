/**
 * Certificate Verification Page
 * Public page to verify certificates using certificate ID or verification code
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Search, AlertCircle } from 'lucide-react';
import { verifyCertificate } from '../services/certificateService';
import { Certificate } from '../services/learningService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [certificateId, setCertificateId] = useState(searchParams.get('certificateId') || '');
  const [verificationCode, setVerificationCode] = useState(searchParams.get('verificationCode') || '');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-verify if params are provided
  useEffect(() => {
    if (certificateId || verificationCode) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async () => {
    if (!certificateId && !verificationCode) {
      setError('Please enter either a Certificate ID or Verification Code');
      return;
    }

    try {
      setIsVerifying(true);
      setError(null);
      setIsVerified(null);
      setCertificate(null);

      const result = await verifyCertificate(
        certificateId || undefined,
        verificationCode || undefined
      );

      if (result.valid && result.certificate) {
        setIsVerified(true);
        setCertificate(result.certificate);
      } else {
        setIsVerified(false);
        setError(result.message || 'Certificate not found or invalid');
      }
    } catch (err) {
      setIsVerified(false);
      setError(err instanceof Error ? err.message : 'Failed to verify certificate');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleViewCertificate = () => {
    if (certificate) {
      navigate(`/certificate/${certificate.certificateId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-2">Verify Certificate</h1>
          <p className="text-muted-foreground">
            Enter a certificate ID or verification code to verify authenticity
          </p>
        </motion.div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Certificate Verification</CardTitle>
            <CardDescription>
              Verify the authenticity of a certificate using its ID or verification code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="certificateId">Certificate ID</Label>
                <Input
                  id="certificateId"
                  type="text"
                  placeholder="Enter certificate ID (e.g., xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleVerify();
                    }
                  }}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div>
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="Enter 8-character verification code (e.g., ABC123XY)"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  maxLength={8}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleVerify();
                    }
                  }}
                />
              </div>

              <Button
                onClick={handleVerify}
                disabled={isVerifying || (!certificateId && !verificationCode)}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Verify Certificate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Verification Result */}
        {isVerified !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isVerified && certificate ? (
              <Card className="border-green-500 bg-green-50 dark:bg-green-950">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                        Certificate Verified
                      </h3>
                      <p className="text-green-800 dark:text-green-200 mb-4">
                        This certificate is valid and authentic.
                      </p>

                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Recipient:</span>
                          <span className="font-semibold">{certificate.contactName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Course:</span>
                          <span className="font-semibold">{certificate.learningMaterialTitle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Issued Date:</span>
                          <span>{new Date(certificate.issuedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Certificate ID:</span>
                          <span className="font-mono text-xs">{certificate.certificateId}</span>
                        </div>
                      </div>

                      <Button onClick={handleViewCertificate} className="w-full">
                        View Full Certificate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-red-500 bg-red-50 dark:bg-red-950">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <XCircle className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">
                        Certificate Not Verified
                      </h3>
                      <p className="text-red-800 dark:text-red-200">
                        {error || 'The certificate could not be verified. Please check the ID or verification code and try again.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    <strong>Certificate ID:</strong> A unique identifier found on the certificate (UUID format).
                  </p>
                  <p>
                    <strong>Verification Code:</strong> An 8-character alphanumeric code that can be used to verify the certificate's authenticity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyCertificate;

