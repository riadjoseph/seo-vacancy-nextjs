import { Info, CheckCircle, Clock, MessageSquare } from "lucide-react"; // Import MessageSquare for the WhatsApp icon
import { Link } from "react-router-dom";

const Footer = () => {
  const totalJobs = 286;

  const topCities = [
    { name: "Manchester", count: 18 },
    { name: "Amsterdam", count: 16 },
    { name: "Vilnius", count: 14 },
  ];

  const topTags = [
    { name: "Technical SEO", count: 105 },
    { name: "E-commerce SEO", count: 102 },
    { name: "Enterprise SEO", count: 98 },
  ];

  return (
    <footer className="mt-auto bg-gray-50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
              WakeUpHappy: Dedicated Jobboard for SEO Professionals in Europe
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
              Seamless job posting without the clutter—no newsletters, no ads, just results. Support us by posting your jobs here. Contribute a small amount to get your ad featured!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
              Eliminate the distractions and discover only the job opportunities that matter to you.
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
                Stay Updated with Our WhatsApp Notifications - in progress.
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Total Jobs Available</h3>
            <p className="text-sm text-gray-600">{totalJobs} jobs listed</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Top 10 Cities for SEO Jobs</h3>
            <div className="flex flex-col">
              {topCities.map((city, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-1/2">{city.name}</div>
                  <div className="w-1/2 bg-gray-300 h-4" style={{ width: `${city.count * 5}px` }} />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Top 3 Tags</h3>
            <div className="flex flex-col">
              {topTags.map((tag, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-1/2">{tag.name}</div>
                  <div className="w-1/2 bg-gray-300 h-4" style={{ width: `${tag.count * 0.5}px` }} />
                </div>
              ))}
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
