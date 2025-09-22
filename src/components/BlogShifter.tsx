import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, ArrowRight, BarChart3 } from "lucide-react";

const BlogShifter = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of CRM: AI-Powered Customer Insights",
      excerpt: "Discover how artificial intelligence is revolutionizing customer relationship management and driving business growth.",
      author: "Mina Michel",
      date: "Dec 15, 2024",
      category: "AI & CRM",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Salesforce Implementation Best Practices for 2025",
      excerpt: "Essential strategies and tips for successful Salesforce deployment that maximize ROI and user adoption.",
      author: "Ashraf Rezk",
      date: "Dec 12, 2024",
      category: "Implementation",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Customer Experience Optimization in the Digital Age",
      excerpt: "Learn how to leverage modern CRM tools to create exceptional customer experiences that drive loyalty.",
      author: "Marina Danial",
      date: "Dec 10, 2024",
      category: "Customer Experience",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Automation Workflows That Transform Business Processes",
      excerpt: "Explore advanced automation techniques that streamline operations and boost productivity across your organization.",
      author: "Mourad Takawi",
      date: "Dec 8, 2024",
      category: "Automation",
      readTime: "8 min read"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % blogPosts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [blogPosts.length]);

  const currentPost = blogPosts[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Progress Line */}
      <div className="mb-8">
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-gradient"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
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
          className="bg-gradient-to-br from-card/90 to-background/90 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-brand-primary/30 transition-all duration-500 group perspective-1000"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-sm font-medium">
                  {currentPost.category}
                </span>
                <span className="text-muted-foreground text-sm">{currentPost.readTime}</span>
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 group-hover:text-brand-primary transition-colors duration-300">
                {currentPost.title}
              </h3>
              
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {currentPost.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{currentPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{currentPost.date}</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ x: 5 }}
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
      <div className="flex justify-center mt-8 gap-4">
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
    </div>
  );
};

export default BlogShifter;