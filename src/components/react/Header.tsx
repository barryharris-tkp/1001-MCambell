import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  currentPath: string;
}

const Header = ({ currentPath }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isHome = currentPath === "/";
  const isActive = (path: string) => currentPath === path;

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1) over the first 150px of scrolling
      const progress = Math.min(window.scrollY / 150, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/about", label: "About" },
    { path: "/resources", label: "Resources" },
    { path: "/contact", label: "Contact" },
  ];

  // Transparent on home page when not scrolled, solid otherwise
  const isTransparent = isHome && scrollProgress < 0.5;

  // Dynamic blur and opacity based on scroll
  const headerStyle = isHome ? {
    backgroundColor: `hsl(var(--primary) / ${0.3 + scrollProgress * 0.65})`,
    backdropFilter: `blur(${4 + scrollProgress * 12}px)`,
    WebkitBackdropFilter: `blur(${4 + scrollProgress * 12}px)`,
  } : undefined;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isHome
          ? scrollProgress > 0.8 ? "border-b shadow-sm" : ""
          : "bg-background/95 backdrop-blur border-b shadow-sm"
      }`}
      style={headerStyle}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <a href="/" className="flex flex-col relative z-10 py-2">
            <div className="relative inline-block">
              <span
                className="font-cormorant font-semibold tracking-wide transition-all duration-300 text-white drop-shadow-lg"
                style={{
                  fontSize: `${34 - scrollProgress * 12}px`,
                  letterSpacing: '0.02em',
                }}
              >
                Campbell Tax Services PC
              </span>
              {/* Gold accent underline with diamond endpoints */}
              <div
                className="absolute left-0 right-0 flex items-center justify-center transition-all duration-300"
                style={{
                  bottom: `-${4 + scrollProgress * 2}px`,
                  opacity: 1 - scrollProgress * 0.3,
                  transform: `scaleX(${0.7 + scrollProgress * 0.1})`,
                }}
              >
                {/* Left diamond */}
                <div
                  className="w-[5px] h-[5px] rotate-45 flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45 85% 65%) 0%, hsl(38 75% 50%) 100%)',
                    boxShadow: '0 0 4px hsl(38 75% 55% / 0.5)',
                  }}
                />
                {/* Center line */}
                <div
                  className="h-[2px] flex-grow mx-1 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, hsl(38 75% 55%) 0%, hsl(45 85% 60%) 50%, hsl(38 75% 55%) 100%)',
                  }}
                />
                {/* Right diamond */}
                <div
                  className="w-[5px] h-[5px] rotate-45 flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45 85% 65%) 0%, hsl(38 75% 50%) 100%)',
                    boxShadow: '0 0 4px hsl(38 75% 55% / 0.5)',
                  }}
                />
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? isTransparent
                      ? "bg-white/20 text-white"
                      : "bg-primary text-primary-foreground"
                    : isTransparent
                      ? "text-white hover:bg-white/10"
                      : "text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Button
              asChild
              size="sm"
              className={`ml-4 ${
                isTransparent
                  ? "bg-white text-primary hover:bg-white/90"
                  : "bg-accent text-accent-foreground hover:bg-accent/90"
              }`}
            >
              <a href="/contact">Client Portal</a>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 transition-colors ${
              isTransparent ? "text-white" : "text-foreground"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className={`md:hidden py-4 space-y-2 ${
            isTransparent ? "bg-black/50 backdrop-blur-md rounded-lg px-4 -mx-4" : ""
          }`}>
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? isTransparent
                      ? "bg-white/20 text-white"
                      : "bg-primary text-primary-foreground"
                    : isTransparent
                      ? "text-white hover:bg-white/10"
                      : "text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="px-4 pt-2">
              <Button
                asChild
                className={`w-full ${
                  isTransparent
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-accent text-accent-foreground hover:bg-accent/90"
                }`}
              >
                <a href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Client Portal
                </a>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
