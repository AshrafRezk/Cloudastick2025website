/**
 * Certificate Display Page
 * Public page to view certificates by certificate ID
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Share2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { getCertificate } from '../services/certificateService';
import { Certificate } from '../services/learningService';
import CertificateViewer from '../components/CertificateViewer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';

const Certificate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!id) {
        setError('Certificate ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const cert = await getCertificate(id);
        if (cert) {
          setCertificate(cert);
        } else {
          setError('Certificate not found');
        }
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError(err instanceof Error ? err.message : 'Failed to load certificate');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!certificate) return;

    try {
      // Generate PDF using the PDF generation endpoint
      const response = await fetch('/.netlify/functions/generateCertificatePDF', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certificateId: certificate.certificateId }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${certificate.certificateId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: 'PDF Downloaded',
          description: 'Your certificate has been downloaded successfully.',
        });
      } else {
        // Fallback: print the certificate
        window.print();
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback: print the certificate
      window.print();
    }
  };

  const handleShare = async () => {
    if (!certificate) return;

    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link Copied!',
        description: 'Certificate link has been copied to clipboard.',
      });
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Certificate Not Found</h2>
            <p className="text-muted-foreground mb-6">{error || 'The certificate you are looking for does not exist or has been revoked.'}</p>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex justify-between items-center"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm text-muted-foreground">Verified Certificate</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleDownloadPDF} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </motion.div>

        {/* Certificate Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-xl overflow-hidden"
        >
          <div className="p-4 print:p-0">
            <CertificateViewer certificate={certificate} showVerificationCode={true} />
          </div>
        </motion.div>

        {/* Verification Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Certificate Verification</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Certificate ID:</span>
                <span className="font-mono">{certificate.certificateId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Verification Code:</span>
                <span className="font-mono font-semibold">{certificate.verificationCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issued Date:</span>
                <span>{new Date(certificate.issuedDate).toLocaleDateString()}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/verify-certificate?certificateId=${certificate.certificateId}`)}
                >
                  Verify Certificate
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-container,
          .certificate-container * {
            visibility: visible;
          }
          .certificate-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 297mm;
          }
        }
      `}</style>
    </div>
  );
};

export default Certificate;

