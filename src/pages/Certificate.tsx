/**
 * Certificate Display Page
 * Public page to view certificates by certificate ID
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Share2, CheckCircle2, Loader2, AlertCircle, Linkedin } from 'lucide-react';
import html2canvas from 'html2canvas';
import { getCertificate } from '../services/certificateService';
import { type Certificate } from '../services/learningService';
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

  const handleDownloadImage = async () => {
    if (!certificate) return;

    try {
      const element = document.getElementById('certificate-to-download');
      if (!element) return;

      toast({
        title: 'Preparing Image',
        description: 'Generating high-quality certificate image...',
      });

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificate.certificateId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: 'Image Downloaded',
        description: 'Your certificate image has been downloaded successfully.',
      });
    } catch (err) {
      console.error('Error generating image:', err);
      toast({
        title: 'Download Failed',
        description: 'Failed to generate certificate image. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShareLinkedIn = () => {
    if (!certificate) return;

    const url = window.location.href;
    const text = `I'm proud to share that I've successfully completed the course "${certificate.learningMaterialTitle}" and earned my certification from Cloudastick! %0A%0ACheck out my certificate here:`;

    // LinkedIn share URL format
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${text}`;

    window.open(linkedInUrl, '_blank', 'width=600,height=600');
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
            <Button variant="outline" onClick={handleShareLinkedIn} size="sm" className="bg-[#0077b5] text-white hover:bg-[#006699] border-none">
              <Linkedin className="h-4 w-4 mr-2" />
              Share on LinkedIn
            </Button>
            <Button variant="outline" onClick={handleShare} size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button onClick={handleDownloadImage} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Image
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

      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
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
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 40px !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default Certificate;

