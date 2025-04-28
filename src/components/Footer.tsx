import { Info, CheckCircle, Clock, MessageSquare } from "lucide-react"; // Import MessageSquare for the WhatsApp icon
import { Link } from "react-router-dom";

const Footer = () => {
  const totalJobs = 335;

  const topCities = [
    { name: "London", count: 20 },
    { name: "Vilnius", count: 16 },
    { name: "Lisbon", count: 15 },
  ];

  const topTags = [
    { name: "Content SEO", count: 133 },
    { name: "SEO Strategy & Management", count: 115 },
    { name: "E-commerce SEO", count: 106 },
  ];

  return (
    <footer className="mt-auto bg-gray-50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
              WakeUpHappy: Your Premier Job Board for SEO Professionals in Europe.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
              Enjoy seamless job postings without the clutter—no newsletters, no ads, just results. Support our mission by posting your jobs here. Contribute a small amount to get your ad featured!
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
                Stay Updated with Our WhatsApp Notifications
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Latest Jobs Available</h3>
            <p className="text-sm text-gray-600">{totalJobs} jobs active this week</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Top Cities this week</h3>
            <div className="flex flex-col space-y-2">
              {topCities.map((city, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex justify-between mb-1">
                    <Link 
                      to={`/jobs/city/${city.name.toLowerCase()}`}
                      className="text-sm font-medium text-gray-700 hover:text-primary"
                    >
                      {city.name} SEO Jobs
                    </Link>
                    <span className="text-sm font-medium text-gray-700">{city.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-400 h-2.5 rounded-full" 
                      style={{ width: `${(city.count / 20) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Top Skills this week</h3>
            <div className="flex flex-col space-y-2">
              {topTags.map((tag, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex justify-between mb-1">
                    <Link 
                       to={`/jobs/tag/${tag.name.toLowerCase().replace(/ /g, '-').replace(/&/g, '&')}`}
                      className="text-sm font-medium text-gray-700 hover:text-primary"
                    >
                      {tag.name} Jobs
                    </Link>
                    <span className="text-sm font-medium text-gray-700">{tag.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-400 h-2.5 rounded-full" 
                      style={{ width: `${(tag.count / 110) * 100}%` }} 
                    />
                  </div>
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
