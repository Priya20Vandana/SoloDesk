
import { Heart, CircleCheck } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-copyright">
        <span>© {new Date().getFullYear()} SoloDesk</span>
        <span className="app-footer-separator">·</span>
        <span>Built for independent work.</span>
      </div>

      <div className="app-footer-meta">
        <span className="app-footer-status">
          <CircleCheck size={14} />
          All systems operational
        </span>

        <span className="app-footer-made-with">
          Made with <Heart size={13} /> for freelancers
        </span>
      </div>
    </footer>
  );
}

export default Footer;
