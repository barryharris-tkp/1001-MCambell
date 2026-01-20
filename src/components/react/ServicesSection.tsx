import { Button } from "@/components/ui/button";
import { FileText, Calculator, LineChart, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ServicesSection = () => {
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

  const services = [
    {
      icon: FileText,
      title: "Tax Services",
      description: "Comprehensive tax preparation and planning for individuals and businesses",
      features: [
        "Individual Returns",
        "Partnerships & Corporations",
        "Sub S & C-corps",
        "LLCs, Estates & Trusts",
        "Exempt Organizations",
        "Multi-state Returns"
      ]
    },
    {
      icon: Calculator,
      title: "Accounting",
      description: "Professional bookkeeping and accounting services to keep your finances in order",
      features: [
        "Bookkeeping Services",
        "Payroll Management",
        "Account Reconciliations",
        "Financial Statements",
        "Monthly/Quarterly Reports",
        "Year-End Closing"
      ]
    },
    {
      icon: LineChart,
      title: "Consulting",
      description: "Strategic business consulting to optimize your operations and profitability",
      features: [
        "Cost Accounting",
        "Inventory Management",
        "Internal Controls",
        "Performance Measures",
        "Product Configurator",
        "Operations Analysis"
      ]
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 relative">
      {/* Semi-transparent overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background/80 backdrop-blur-sm" />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive financial solutions tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`glass-card-light p-8 rounded-2xl hover:scale-[1.02] transition-all duration-500 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : '0ms' }}
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <service.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-playfair">{service.title}</h3>
              <p className="text-muted-foreground mb-6">{service.description}</p>
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full hover:scale-[1.02] transition-transform" variant="outline">
                <a href="/services">Learn More</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
