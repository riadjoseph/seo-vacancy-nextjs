import { Info, CheckCircle, Clock } from "lucide-react";
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
                WakeUpHappy is a job board dedicated to SEO talent in Europe.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Complimentary job posting - no fees, no newsletters, no ads, and no noise. Support the project with "Buy a coffee", have your ad featured.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                We might quality check before the job goes live.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;