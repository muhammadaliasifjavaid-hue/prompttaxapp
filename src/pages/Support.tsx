import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";

const faqs = [
  {
    q: "How does PromptTax calculate my AI environmental impact?",
    a: "We use a deterministic, formula based model that combines your reported usage time with server power consumption estimates, regional grid carbon intensity, water usage coefficients, and air pollutant factors. No AI or machine learning is used in any estimation. See our Methodology page for complete details.",
  },
  {
    q: "How accurate are the estimates?",
    a: "All estimates carry a ±35% uncertainty range. The main sources of uncertainty are variations in actual server hardware efficiency, datacenter PUE, hourly grid mix changes (we use annual averages), and the difference between screen time and active inference time. These numbers are designed for awareness, not regulatory compliance.",
  },
  {
    q: "Where does my data go?",
    a: "Your usage data is stored locally in your browser. We do not send personal usage data to external servers. If you create an account, minimal profile data is stored securely. You can delete all your data at any time from the Settings page.",
  },
  {
    q: "What is the Offset Store?",
    a: "The Offset Store lets you purchase carbon credits to compensate for your computed emissions. Currently running in simulation mode, purchases are recorded locally and demonstrate how offsetting would work. We list real project types with transparent metadata including verification standard, vintage, and region.",
  },
  {
    q: "Can I connect my actual screen time data?",
    a: "Yes. We support iOS Screen Time export via Shortcuts (JSON upload), Android Digital Wellbeing export (CSV/JSON upload), and manual entry. A browser extension for automatic tracking is planned for a future release.",
  },
  {
    q: "How do I change my region?",
    a: "Go to Settings and select your region from the dropdown. Your region determines which grid intensity and environmental coefficients are used in calculations. We currently support 13+ regions across 10 countries.",
  },
  {
    q: "What AI tools are covered?",
    a: "We track five categories: AI Chatbots (ChatGPT, Claude, Gemini), AI Search (Perplexity, Google AI Overview), Image Generation (DALL·E, Midjourney), Video Generation (Sora, Runway), and AI Writing Assistants (Grammarly AI, Notion AI).",
  },
  {
    q: "Is PromptTax free to use?",
    a: "The dashboard, calculations, and reports are completely free. The Offset Store will involve payments when it moves beyond simulation mode, but all core features will remain free.",
  },
];

export default function SupportPage() {
  return (
    <Layout>
      <div className="container py-12 max-w-3xl space-y-12">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary mx-auto">
            <HelpCircle className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Support &amp; FAQ</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find answers to common questions or reach out to our team
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="p-0 rounded-xl glass overflow-hidden border-0"
            >
              <AccordionTrigger className="px-5 py-4 text-left text-sm font-medium hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="p-6 rounded-2xl glass text-center space-y-4">
          <h3 className="font-display font-semibold">Still have questions?</h3>
          <p className="text-sm text-muted-foreground">
            Our team is happy to help. Reach out and we will get back to you within 24 hours.
          </p>
          <Button className="gradient-primary text-white border-0 gap-1.5">
            <Mail className="h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>
    </Layout>
  );
}
