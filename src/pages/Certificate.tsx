/**
 * Certificate Display Page
 * Public page to view certificates by certificate ID
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, CheckCircle2, Loader2, AlertCircle, Linkedin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
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



  const handleShareLinkedIn = async () => {
    if (!certificate) return;

    const url = window.location.href;
    const shareText = `I'm happy to announce that I've earned the "${certificate.learningMaterialTitle}" certificate in Cloudastick Systems! 🎓✨\n\nHere's to growth and development! 🚀`;

    // 1. Attempt Web Share API first (best for mobile, populates post body in some apps)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${certificate.learningMaterialTitle} Certificate`,
          text: shareText,
          url: url,
        });
        return;
      } catch (err) {
        console.log('Web Share failed or cancelled', err);
      }
    }

    // 2. Fallback: Copy to clipboard and open LinkedIn
    try {
      await navigator.clipboard.writeText(`${shareText}\n\nCheck out my certificate here: ${url}`);
      toast({
        title: 'Message Copied!',
        description: 'Your celebratory message is copied! Paste it into your LinkedIn post.',
      });
    } catch (err) {
      console.error('Clipboard error', err);
    }

    // Open LinkedIn Share dialog
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
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
      <Helmet>
        <title>{certificate.contactName} - {certificate.learningMaterialTitle} Certificate | Cloudastick</title>
        <meta property="og:title" content={`${certificate.contactName} earned a certification in ${certificate.learningMaterialTitle}!`} />
        <meta property="og:description" content={`Verified certificate of completion for "${certificate.learningMaterialTitle}" from Cloudastick Systems. A milestone in professional development.`} />
        <meta property="og:image" content={certificate.certificateLogoUrl || "https://cloudastick.com/Assets/Company%20Logos/blue-logo.png"} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${certificate.contactName} - ${certificate.learningMaterialTitle} Certificate`} />
        <meta name="twitter:description" content="View this verified certificate of completion from Cloudastick Systems." />
      </Helmet>
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
            <Button variant="outline" onClick={handleShareLinkedIn} size="sm" className="bg-[#0077b5] text-white hover:bg-[#006699] border-none group">
              <Linkedin className="h-4 w-4 mr-2" />
              Share on LinkedIn
            </Button>
            <Button variant="outline" onClick={handleShare} size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
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

