import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Upload,
  AlertCircle,
} from "lucide-react";
import Button from "../components/Button";
import { useToast } from "@/hooks/use-toast";
import {
  CaptureRecord,
  submitCapture,
  listCaptures,
} from "../services/captureService";
import ProgrammableSearch from "../components/ProgrammableSearch";

const CaptureIntelligence = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [hasCameraAccess, setHasCameraAccess] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CaptureRecord | null>(null);
  const [records, setRecords] = useState<CaptureRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [initializingCamera, setInitializingCamera] = useState(true);

  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    setStream((currentStream) => {
      currentStream?.getTracks().forEach((track) => track.stop());
      return null;
    });

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setHasCameraAccess(false);
      setInitializingCamera(false);
      return;
    }

    setInitializingCamera(true);

    try {
      stopCamera();

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => undefined);
      }

      setStream(mediaStream);
      setCameraReady(true);
      setHasCameraAccess(true);
      setError(null);
    } catch (err) {
      console.error("Unable to access camera", err);
      setStream(null);
      setCameraReady(false);
      setHasCameraAccess(false);
      setError(
        "We couldn't access your camera. Please allow permissions or use the upload fallback."
      );
      toast({
        title: "Camera unavailable",
        description:
          "Grant camera permissions or choose an image from your device instead.",
        variant: "destructive",
      });
    } finally {
      setInitializingCamera(false);
    }
  }, [stopCamera, toast]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      setError("Unable to capture frame from the current video stream.");
      return;
    }

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
    setAnalysis(null);
    setError(null);

    toast({
      title: "Frame captured",
      description: "Review the snapshot before sending it for analysis.",
    });
  }, [toast]);

  const handleFileUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please upload a supported image file.");
        toast({
          title: "Unsupported file",
          description: "Only image formats can be analyzed.",
          variant: "destructive",
        });
        event.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setAnalysis(null);
        setError(null);
        toast({
          title: "Image ready",
          description: "We've prepared your uploaded image for analysis.",
        });
      };
      reader.onerror = () => {
        setError("We couldn't read that file. Please try another image.");
        toast({
          title: "Upload failed",
          description: "We couldn't read that file. Please try another image.",
          variant: "destructive",
        });
      };

      reader.readAsDataURL(file);
      event.target.value = "";
    },
    [toast]
  );

  const fetchRecords = useCallback(async () => {
    setLoadingRecords(true);
    try {
      const items = await listCaptures();
      setRecords(items);
      return items;
    } catch (err) {
      console.error("Unable to load capture history", err);
      setError("Unable to load previous captures. Try again in a moment.");
      return undefined;
    } finally {
      setLoadingRecords(false);
    }
  }, []);

  const handleConfirmCapture = useCallback(async () => {
    if (!capturedImage) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitCapture({
        imageData: capturedImage,
        source: hasCameraAccess ? "camera" : "upload",
      });

      setAnalysis(response.record);
      toast({
        title: "Capture analyzed",
        description: response.message ?? "We've recorded the analysis for your review.",
      });
      await fetchRecords();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "We couldn't analyze this capture. Please try again.";
      setError(message);
      toast({
        title: "Analysis failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [capturedImage, fetchRecords, hasCameraAccess, toast]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setAnalysis(null);
    setError(null);
    if (!stream) {
      startCamera();
    }
  }, [startCamera, stream]);

  useEffect(() => {
    let mounted = true;

    const initialise = async () => {
      await fetchRecords();
      if (mounted) {
        await startCamera();
      }
    };

    if (typeof window !== "undefined") {
      initialise();
    }

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [fetchRecords, startCamera, stopCamera]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Insight Operations</p>
          <h1 className="text-4xl md:text-5xl font-bold">Capture Intelligence</h1>
          <p className="text-gray-400 max-w-2xl">
            Use your device camera to capture intelligence from business cards, badges, or brochures. We’ll classify the opportunity, extract company insights, and surface decision makers so your team can act immediately.
          </p>
        </header>

        <section className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
          <div className="space-y-6">
            <div className="relative bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured frame"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                    {(!cameraReady || initializingCamera) && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-900/80">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                        <p className="text-sm text-gray-400">Initializing camera feed…</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {!hasCameraAccess && (
                <div className="absolute inset-x-0 bottom-0 bg-gray-900/90 border-t border-gray-800 p-4">
                  <div className="flex items-start gap-3 text-sm text-red-300">
                    <AlertCircle className="w-5 h-5 mt-0.5" />
                    <p>
                      Camera access is disabled. Upload an image from your device to continue.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {stream ? (
                <Button
                  onClick={stopCamera}
                  variant="secondary"
                  disabled={isSubmitting}
                >
                  <CameraOff className="w-4 h-4 mr-2" /> Stop camera
                </Button>
              ) : (
                <Button
                  onClick={startCamera}
                  variant="secondary"
                  disabled={initializingCamera || isSubmitting}
                >
                  <Camera className="w-4 h-4 mr-2" /> Start camera
                </Button>
              )}

              <Button
                onClick={captureFrame}
                disabled={!stream || !cameraReady || isSubmitting || initializingCamera}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Capture frame
              </Button>

              <Button
                onClick={handleRetake}
                variant="outline"
                disabled={!capturedImage || isSubmitting}
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Retake
              </Button>

              <Button
                onClick={handleConfirmCapture}
                disabled={!capturedImage || isSubmitting}
                className="flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm & Analyze
                  </>
                )}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="secondary"
                disabled={isSubmitting}
                className="flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" /> Upload image
              </Button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-200 text-sm rounded-xl p-4">
                {error}
              </div>
            )}
          </div>

          <aside className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Analysis</h2>
              <p className="text-sm text-gray-400">
                Once you confirm, we’ll run the capture through our intelligence pipeline and keep a record for your team.
              </p>
            </div>

                {analysis ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase text-cyan-300 tracking-[0.3em]">Classification</p>
                      <p className="text-2xl font-semibold mt-2">{analysis.classification}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Recorded on {new Date(analysis.createdAt).toLocaleString()}
                  </p>
                </div>

                {analysis.company && (
                  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-2">
                    <h3 className="text-sm uppercase tracking-[0.2em] text-gray-400">Company</h3>
                    <p className="text-lg font-semibold">{analysis.company.name ?? "Unknown"}</p>
                    <dl className="grid grid-cols-1 gap-2 text-sm text-gray-300">
                      {analysis.company.industry && (
                        <div>
                          <dt className="text-gray-500">Industry</dt>
                          <dd>{analysis.company.industry}</dd>
                        </div>
                      )}
                      {analysis.company.location && (
                        <div>
                          <dt className="text-gray-500">Location</dt>
                          <dd>{analysis.company.location}</dd>
                        </div>
                      )}
                      {analysis.company.website && (
                        <div>
                          <dt className="text-gray-500">Website</dt>
                          <dd className="break-all">{analysis.company.website}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {(analysis.decisionMakers?.length ?? 0) > 0 ? (
                  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-3">
                    <h3 className="text-sm uppercase tracking-[0.2em] text-gray-400">Key Decision Makers</h3>
                    <ul className="space-y-2 text-sm text-gray-200">
                      {analysis.decisionMakers.map((person) => (
                        <li
                          key={`${person.name}-${person.title}`}
                          className="border border-gray-700/60 rounded-lg p-3"
                        >
                          <p className="font-medium">{person.name}</p>
                          {person.title && (
                            <p className="text-xs text-gray-400">{person.title}</p>
                          )}
                          {(person.email || person.linkedin) && (
                            <div className="mt-2 text-xs text-gray-400 space-y-1">
                              {person.email && <p>{person.email}</p>}
                              {person.linkedin && <p>{person.linkedin}</p>}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Decision makers will appear here after a successful analysis.
                  </p>
                )}

                {analysis.notes && (
                  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-sm text-gray-300">
                    {analysis.notes}
                  </div>
                )}

                {analysis.briefing && (
                  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-4">
                    <div>
                      <h3 className="text-sm uppercase tracking-[0.2em] text-gray-400">
                        Company briefing
                      </h3>
                      {analysis.briefing.summary && (
                        <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                          {analysis.briefing.summary}
                        </p>
                      )}
                    </div>

                    {[{
                      title: "Active projects",
                      items: analysis.briefing.projects,
                    },
                    {
                      title: "Products & services",
                      items: analysis.briefing.products,
                    },
                    {
                      title: "Latest news",
                      items: analysis.briefing.latestNews,
                    },
                    {
                      title: "Salesforce plays",
                      items: analysis.briefing.salesforceOpportunities,
                    },
                    {
                      title: "Recommended next steps",
                      items: analysis.briefing.nextSteps,
                    }]
                      .filter(({ items }) => items && items.length)
                      .map(({ title, items }) => (
                        <div key={title} className="space-y-2">
                          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                            {title}
                          </p>
                          <ul className="space-y-2 text-sm text-gray-200">
                            {items!.map((entry) => (
                              <li
                                key={`${title}-${entry}`}
                                className="bg-gray-900/60 border border-gray-700/60 rounded-lg px-3 py-2"
                              >
                                {entry}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                )}

                {analysis.source && (
                  <p className="text-xs text-gray-500">
                    Intelligence derived from {analysis.source} capture
                    {analysis.source === "camera" ? " footage" : " input"}.
                  </p>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Capture an image to view structured intelligence, including company data and decision-maker details.
              </div>
            )}
          </aside>
        </section>

        <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="text-xl font-semibold">Stored captures</h2>
              <p className="text-sm text-gray-400">
                Every analyzed capture is retained for follow-up. The newest entries appear first.
              </p>
            </div>
            <Button onClick={fetchRecords} variant="outline" disabled={loadingRecords}>
              {loadingRecords ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Refreshing
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </>
              )}
            </Button>
          </div>

          {records.length === 0 ? (
            <div className="text-sm text-gray-500 border border-dashed border-gray-700 rounded-xl p-6 text-center">
              No captures stored yet. Analyze an image to populate this table.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-400 bg-gray-900">
                    <th className="px-4 py-3">Captured</th>
                    <th className="px-4 py-3">Classification</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Industry</th>
                    <th className="px-4 py-3">Decision makers</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr
                      key={record.id}
                      className="border-t border-gray-800/80 hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(record.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-white">
                        {record.classification}
                      </td>
                      <td className="px-4 py-3 text-gray-200">
                        {record.company?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-200">
                        {record.company?.industry ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {(record.decisionMakers?.length ?? 0) > 0
                          ? record.decisionMakers
                              .map((person) => person.name)
                              .join(", ")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Supplementary research</h2>
            <p className="text-sm text-gray-400">
              Need more context? Search the broader web for company intelligence while
              keeping your capture workflow in view.
            </p>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <ProgrammableSearch />
          </div>
        </section>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CaptureIntelligence;
