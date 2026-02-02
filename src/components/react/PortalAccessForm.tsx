import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const WEB3FORMS_KEY = import.meta.env.PUBLIC_WEB3FORMS_KEY;

const PortalAccessForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Portal Access Request",
          from_name: formData.name,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "Not provided",
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Access Request Submitted!",
          description: "We'll review your request and send you a signup link shortly.",
        });
        setFormData({ name: "", email: "", phone: "" });
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again or call us directly.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <>
      <Card className="border-2 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Request Portal Access</CardTitle>
          <CardDescription className="text-base">
            Fill out the form below and we'll send you a signup link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Your full name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Sending... <Loader2 className="ml-2 animate-spin" /></>
              ) : (
                <>Request Access <Send className="ml-2" /></>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </>
  );
};

export default PortalAccessForm;
