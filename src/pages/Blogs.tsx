import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Loader2, BookOpen, ChevronDown } from "lucide-react";
import { useSalesforce } from "../contexts/SalesforceContext";
import { fetchAllBlogs, type BlogPost } from "../services/blogService";
import AnimatedSection from "../components/AnimatedSection";

const INITIAL_BLOG_COUNT = 10;
const BLOGS_PER_LOAD = 10;

const Blogs = () => {
  const { authData, isLoading: authLoading } = useSalesforce();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

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
        // Initially fetch first page (10 blogs)
        const data = await fetchAllBlogs(
          authData.access_token,
          authData.instance_url,
          1,
          INITIAL_BLOG_COUNT
        );
        
        setBlogs(data.blogs);
        setTotalCount(data.pagination.totalCount);
        setHasMore(data.pagination.hasNextPage);
      } catch (err) {
        console.error("Failed to load blogs:", err);
        setError(err instanceof Error ? err.message : "Failed to load blogs");
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogs();
  }, [authData, authLoading]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore || !authData?.access_token || !authData?.instance_url) return;

    try {
      setIsLoadingMore(true);
      // Calculate next page based on current number of blogs loaded
      const nextPage = Math.floor(blogs.length / BLOGS_PER_LOAD) + 1;
      const data = await fetchAllBlogs(
        authData.access_token,
        authData.instance_url,
        nextPage,
        BLOGS_PER_LOAD
      );
      
      // Append new blogs to existing ones
      setBlogs(prev => [...prev, ...data.blogs]);
      setHasMore(data.pagination.hasNextPage);
    } catch (err) {
      console.error("Failed to load more blogs:", err);
      setError(err instanceof Error ? err.message : "Failed to load more blogs");
    } finally {
      setIsLoadingMore(false);
    }
  };


  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
          <p className="text-muted-foreground">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-8">{error}</p>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors duration-300"
            >
              Back to Home
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-brand-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              All Blogs
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover insights, best practices, and updates from our Salesforce experts
          </p>
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-4">
              Showing {blogs.length} of {totalCount} blogs
            </p>
          )}
        </AnimatedSection>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <AnimatedSection className="text-center py-12">
            <p className="text-muted-foreground text-lg">No blogs available at the moment.</p>
          </AnimatedSection>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogs.map((blog, index) => (
                <AnimatedSection key={blog.id} delay={index * 0.1}>
                  <Link to={`/blog/${blog.urlName}`}>
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-brand-primary/30 transition-all duration-300 h-full flex flex-col cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-xs font-medium">
                          Blog
                        </span>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{blog.formattedDate || "Published"}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 hover:text-brand-primary transition-colors duration-300">
                        {blog.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                        {blog.excerpt || "Read the full article to learn more..."}
                      </p>
                      
                      <div className="flex items-center gap-2 text-brand-primary text-sm font-medium mt-auto">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <AnimatedSection className="flex justify-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More</span>
                      <ChevronDown className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </AnimatedSection>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blogs;

