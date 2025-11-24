import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, BarChart3, Loader2, BookOpen } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useSalesforce } from "../contexts/SalesforceContext";
import { fetchBlogs, type BlogPost } from "../services/blogService";

const BlogShifter = () => {
  const navigate = useNavigate();
  const { authData, isLoading: authLoading } = useSalesforce();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs from Salesforce
  useEffect(() => {
    const loadBlogs = async () => {
      if (authLoading) return;
      
      if (!authData?.access_token || !authData?.instance_url) {
        setError("Salesforce authentication not available");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const blogs = await fetchBlogs(authData.access_token, authData.instance_url);
        setBlogPosts(blogs);
        
        // Reset index to 0 when blogs are loaded
        if (blogs.length > 0) {
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Failed to load blogs:", err);
        setError(err instanceof Error ? err.message : "Failed to load blogs");
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogs();
  }, [authData, authLoading]);

  // Auto-rotate through blogs (slowed down to 12 seconds for better readability)
  useEffect(() => {
    if (blogPosts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % blogPosts.length);
    }, 12000); // 12 seconds - slower for better user experience

    return () => clearInterval(interval);
  }, [blogPosts.length]);

  // Handle navigation to blog detail
  const handleReadMore = (urlName: string) => {
    navigate(`/blog/${urlName}`);
  };

  // Calculate read time estimate (rough estimate: 200 words per minute)
  const calculateReadTime = (content: string): string => {
    if (!content) return "2 min read";
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-card/90 to-background/90 backdrop-blur-sm rounded-2xl p-8 border border-border/50 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            <p className="text-muted-foreground">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || blogPosts.length === 0) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-card/90 to-background/90 backdrop-blur-sm rounded-2xl p-8 border border-border/50 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">
              {error || "No blogs available at the moment."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentPost = blogPosts[currentIndex];
  const readTime = calculateReadTime(currentPost.content);

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Progress Line */}
      <div className="mb-8">
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-gradient"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 12, ease: "linear" }}
            key={currentIndex}
          />
        </div>
        <div className="flex justify-between mt-2">
          {blogPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-brand-primary scale-125"
                  : "bg-muted hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Blog Post Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPost.id}
          initial={{ opacity: 0, x: 100, rotateY: -15 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: -100, rotateY: 15 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="bg-gradient-to-br from-card/90 to-background/90 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-brand-primary/30 transition-all duration-500 group perspective-1000 cursor-pointer"
          onClick={() => handleReadMore(currentPost.urlName)}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-sm font-medium">
                  Blog
                </span>
                <span className="text-muted-foreground text-sm">{readTime}</span>
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 group-hover:text-brand-primary transition-colors duration-300">
                {currentPost.title}
              </h3>
              
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {currentPost.excerpt || "Read the full article to learn more..."}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{currentPost.formattedDate || "Published"}</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadMore(currentPost.urlName);
                  }}
                  className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary transition-colors duration-300 group"
                >
                  <span className="text-sm font-medium">Read More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </div>
            </div>
            
            <div className="lg:w-64">
              <div className="w-full h-48 lg:h-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-xl border border-brand-primary/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <BarChart3 className="w-16 h-16 text-brand-primary/60" />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex flex-col items-center mt-8 gap-4">
        {blogPosts.length > 1 && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length)}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 border border-gray-600"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % blogPosts.length)}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors duration-300"
            >
              Next
            </button>
          </div>
        )}
        
        {/* View All Blogs Button */}
        <Link to="/blogs">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300 font-medium"
          >
            <BookOpen className="w-5 h-5" />
            <span>View All Blogs</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default BlogShifter;