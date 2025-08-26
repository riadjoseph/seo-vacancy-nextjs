import { Info, CheckCircle, Clock, MessageSquare } from "lucide-react"; // Import MessageSquare for the WhatsApp icon
import { Link } from "react-router-dom";

const Footer = () => {
  const totalJobs = 463; //  total jobs count, replace with actual data
  const dateUpdated = "26 Aug 2025"; //  date, replace with actual data
  const topCities = [
    { name: "London", count: 45 },
    { name: "Madrid", count: 25 },
    { name: "Berlin", count: 28 },
  ];

  const topTags = [
    { name: "Technical SEO", count: 162 },
    { name: "Enterprise SEO", count: 132 },
    { name: "SEO Strategy & Management", count: 148 },
  ];

  return (
    <footer className="mt-auto bg-gray-50 border-t">
      <div className="container py-12 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
              WakeUpHappy: A no-BS Job Board for SEO Professionals in Europe.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
              Seamless job posting without the clutter: no newsletters, no ads, no endless loops, just results. Support our mission by posting your SEO job here. Contribute a small amount to get your ad featured!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
              Eliminate the distractions, we focus on the job opportunities that matter to you, only.
              </p>
            </div>
            {/* Add the WhatsApp channel link here 
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <a
                href="https://whatsapp.com/channel/0029Vb61lbaAjPXMK7XMne31"
                target="_blank"
                className="text-sm text-gray-600 hover:underline"
              >
                Stay Updated with Our WhatsApp Notifications
              </a>
            </div> */}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Latest Jobs Available</h3>
            <p className="text-sm text-gray-600">{totalJobs} jobs updated {dateUpdated}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Featured Cities this week</h3>
            <div className="flex flex-col space-y-2 pr-2">
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
                      style={{ width: `${(city.count / 110) * 70}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Top Skills this week</h3>
            <div className="flex flex-col space-y-2 pr-2">
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
                      style={{ width: `${(tag.count / 110) * 70}%` }} 
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
