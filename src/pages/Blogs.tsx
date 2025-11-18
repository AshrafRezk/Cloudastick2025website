import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Loader2, BookOpen } from "lucide-react";
import { useSalesforce } from "../contexts/SalesforceContext";
import { fetchAllBlogs, type BlogPost } from "../services/blogService";
import AnimatedSection from "../components/AnimatedSection";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../components/ui/pagination";

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  
  const { authData, isLoading: authLoading } = useSalesforce();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

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
        const data = await fetchAllBlogs(
          authData.access_token,
          authData.instance_url,
          currentPage,
          10
        );
        
        setBlogs(data.blogs);
        setPagination(data.pagination);
      } catch (err) {
        console.error("Failed to load blogs:", err);
        setError(err instanceof Error ? err.message : "Failed to load blogs");
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogs();
  }, [authData, authLoading, currentPage]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Previous button
    if (pagination.hasPreviousPage) {
      pages.push(
        <PaginationItem key="prev">
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
          />
        </PaginationItem>
      );
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={pagination.totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(pagination.totalPages);
            }}
          >
            {pagination.totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    if (pagination.hasNextPage) {
      pages.push(
        <PaginationItem key="next">
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      );
    }

    return pages;
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
          {pagination.totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-4">
              Showing {blogs.length} of {pagination.totalCount} blogs
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <AnimatedSection>
                <Pagination>
                  <PaginationContent>{renderPagination()}</PaginationContent>
                </Pagination>
              </AnimatedSection>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blogs;

