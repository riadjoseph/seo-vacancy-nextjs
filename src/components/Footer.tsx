import { Info, CheckCircle, Clock, MessageSquare } from "lucide-react"; // Import MessageSquare for the WhatsApp icon
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                WakeUpHappy: A Job board for SEOs in Europe.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Hassle-free job posting; no newsletter, no ads, no noise. Support the project, post your jobs here. "Buy me coffee", get your ad featured.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Cut through the noise, see only the jobs you care about.
              </p>
            </div>
            {/* Add the WhatsApp channel link here */}
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <a
                href="https://whatsapp.com/channel/0029Vb61lbaAjPXMK7XMne31"
                target="_blank"
                className="text-sm text-gray-600 hover:underline"
              >
                Get Notified via the WhatsApp Channel
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link to="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
