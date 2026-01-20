import { Award, GraduationCap, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CredentialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const credentials = [
    {
      icon: Shield,
      title: "Certifications",
      items: [
        { text: "Certified Public Accountant", highlight: true },
        { text: "Arkansas License #3029", highlight: false },
        { text: "Tennessee License #24882", highlight: false },
        { text: "Certified Management Accountant", highlight: true },
        { text: "CMA #7202", highlight: false },
        { text: "Certified Global Management Accountant", highlight: true },
      ]
    },
    {
      icon: GraduationCap,
      title: "Education",
      items: [
        { text: "B.S. Accounting", highlight: true },
        { text: "Arkansas State University", highlight: false },
        { text: "MBA", highlight: true },
        { text: "Union University", highlight: false },
        { text: "Jackson, Tennessee", highlight: false },
      ]
    },
    {
      icon: Award,
      title: "Memberships",
      items: [
        { text: "American Institute of CPAs", highlight: false },
        { text: "Arkansas Society of CPAs", highlight: false },
        { text: "Tennessee Society of CPAs", highlight: false },
        { text: "Institute of Management Accountants", highlight: false },
      ]
    }
  ];

  const stats = [
    { value: "45+", label: "Years Experience" },
    { value: "4", label: "Professional Certifications" },
    { value: "4", label: "Professional Associations" },
  ];

  return (
    <section ref={sectionRef} className="py-24 relative">
      {/* Glass background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background/70 backdrop-blur-sm" />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">Professional Credentials</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Licensed and certified with decades of expertise
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {credentials.map((credential, index) => (
            <div
              key={index}
              className={`glass-card-light text-center p-8 rounded-2xl hover:scale-[1.02] transition-all duration-500 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : '0ms' }}
            >
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                <credential.icon className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-6 font-playfair">{credential.title}</h3>
              <ul className="space-y-2 text-muted-foreground">
                {credential.items.map((item, idx) => (
                  <li
                    key={idx}
                    className={item.highlight ? "font-semibold text-foreground pt-2 first:pt-0" : ""}
                  >
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex flex-wrap items-center justify-center gap-8 md:gap-12 glass-card-light p-8 rounded-2xl">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-8 md:gap-12">
                <div className="hover:scale-105 transition-transform cursor-default text-center">
                  <div className="text-5xl font-bold text-primary font-playfair">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
                {index < stats.length - 1 && <div className="hidden md:block h-16 w-px bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CredentialsSection;
