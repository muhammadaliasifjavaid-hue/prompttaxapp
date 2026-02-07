import { Link } from "react-router-dom";
import { Leaf, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold">PromptTax</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Understand the environmental cost of your AI usage. Make informed choices, reduce impact, offset the rest.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm">Product</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/connect" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Connect Data</Link>
              <Link to="/store" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Offset Store</Link>
              <Link to="/reports" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reports</Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm">Resources</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/methodology" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Methodology</Link>
              <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support & FAQ</Link>
              <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Settings</Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-sm">Legal</h4>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Privacy Policy</span>
              <span className="text-sm text-muted-foreground">Terms of Service</span>
              <span className="text-sm text-muted-foreground">Cookie Policy</span>
            </nav>
            <div className="flex gap-3 pt-2">
              <Github className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              <Twitter className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground">
            © 2026 PromptTax. All rights reserved. Emissions estimates are approximate and for informational purposes only.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with care for our planet 🌍
          </p>
        </div>
      </div>
    </footer>
  );
}
