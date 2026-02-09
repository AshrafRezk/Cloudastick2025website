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
  const [recipientName, setRecipientName] = useState(searchParams.get('recipientName') || '');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-verify if params are provided
  useEffect(() => {
    if (certificateId || recipientName) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async () => {
    if (!certificateId && !recipientName) {
      setError('Please enter either a Certificate ID or Recipient Name');
      return;
    }

    try {
      setIsVerifying(true);
      setError(null);
      setIsVerified(null);
      setCertificates([]);

      const result = await verifyCertificate(
        certificateId || undefined,
        recipientName || undefined
      );

      if (result.valid && result.certificates && result.certificates.length > 0) {
        setIsVerified(true);
        setCertificates(result.certificates);
      } else {
        setIsVerified(false);
        setError(result.message || 'No certificates found for this criteria');
      }
    } catch (err) {
      setIsVerified(false);
      setError(err instanceof Error ? err.message : 'Failed to verify certificate');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleViewCertificate = (certId: string) => {
    navigate(`/certificate/${certId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-2">Certificate Lookup</h1>
          <p className="text-muted-foreground">
            Enter a certificate ID or recipient name to find legitimate certificates
          </p>
        </motion.div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Certificates</CardTitle>
            <CardDescription>
              Find and verify certificates issued by Cloudastick
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="certificateId">Certificate ID</Label>
                <Input
                  id="certificateId"
                  type="text"
                  placeholder="Enter certificate ID (e.g., CERT-xxxxxxxx...)"
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
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  type="text"
                  placeholder="Enter recipient full name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleVerify();
                    }
                  }}
                />
              </div>

              <Button
                onClick={handleVerify}
                disabled={isVerifying || (!certificateId && !recipientName)}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Certificates
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
            {isVerified && certificates.length > 0 ? (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">Found {certificates.length} valid certificate{certificates.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {certificates.map((cert) => (
                  <Card key={cert.id} className="border-green-500/20 bg-green-50/50 dark:bg-green-950/20 hover:border-green-500 transition-colors">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-green-800/70 dark:text-green-200/70 font-medium text-sm block">Recipient</span>
                            <span className="font-bold text-green-900 dark:text-green-100">{cert.contactName}</span>
                          </div>
                          <div>
                            <span className="text-green-800/70 dark:text-green-200/70 font-medium text-sm block">Course</span>
                            <span className="font-bold text-green-900 dark:text-green-100">{cert.learningMaterialTitle}</span>
                          </div>
                          <div>
                            <span className="text-green-800/70 dark:text-green-200/70 font-medium text-sm block">Date of Completion</span>
                            <span className="font-bold text-green-900 dark:text-green-100">{new Date(cert.issuedDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-green-800/70 dark:text-green-200/70 font-medium text-sm block">Certificate ID</span>
                            <span className="font-mono text-xs font-bold text-green-900 dark:text-green-100 break-all">{cert.certificateId}</span>
                          </div>
                        </div>

                        <Button onClick={() => handleViewCertificate(cert.certificateId)} className="w-full" variant="outline">
                          View Certificate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-red-500 bg-red-50 dark:bg-red-950">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <XCircle className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">
                        No Certificates Found
                      </h3>
                      <p className="text-red-800 dark:text-red-200">
                        {error || 'We could not find any certificates matching your criteria. Please check the ID or name and try again.'}
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
                    <strong>Certificate ID:</strong> Unique identifier found on the certificate (e.g., CERT-...).
                  </p>
                  <p>
                    <strong>Recipient Name:</strong> Full name of the person who completed the course.
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

