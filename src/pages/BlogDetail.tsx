import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useSalesforce } from "../contexts/SalesforceContext";
import { fetchBlogByUrlName, type BlogPost } from "../services/blogService";
import AnimatedSection from "../components/AnimatedSection";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { authData, isLoading: authLoading } = useSalesforce();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      if (!slug) {
        setError("Blog URL name is missing");
        setIsLoading(false);
        return;
      }

      if (authLoading) return;

      if (!authData?.access_token || !authData?.instance_url) {
        setError("Salesforce authentication not available");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const blogData = await fetchBlogByUrlName(slug, authData.access_token, authData.instance_url);
        
        if (!blogData) {
          setError("Blog not found");
        } else {
          setBlog(blogData);
        }
      } catch (err) {
        console.error("Failed to load blog:", err);
        setError(err instanceof Error ? err.message : "Failed to load blog");
      } finally {
        setIsLoading(false);
      }
    };

    loadBlog();
  }, [id, authData, authLoading]);

  // Render HTML content safely
  const renderContent = (content: string) => {
    if (!content) return null;
    
    // Check if content contains HTML tags
    const hasHTML = /<[^>]+>/.test(content);
    
    if (hasHTML) {
      return (
        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    
    // Plain text - preserve line breaks
    return (
      <div className="whitespace-pre-wrap text-foreground leading-relaxed">
        {content}
      </div>
    );
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
          <p className="text-muted-foreground">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-8">{error || "The blog you're looking for doesn't exist."}</p>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors duration-300 flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <AnimatedSection>
          <Link to="/">
            <motion.button
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </motion.button>
          </Link>
        </AnimatedSection>

        {/* Blog Header */}
        <AnimatedSection delay={0.1}>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-sm font-medium">
                Blog
              </span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{blog.formattedDate || "Published"}</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {blog.title}
            </h1>
          </div>
        </AnimatedSection>

        {/* Blog Content */}
        <AnimatedSection delay={0.2}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-border/50"
          >
            <div className="prose prose-lg prose-invert max-w-none">
              {renderContent(blog.content)}
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Footer Actions */}
        <AnimatedSection delay={0.3} className="mt-12">
          <div className="flex justify-center">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </motion.button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default BlogDetail;

