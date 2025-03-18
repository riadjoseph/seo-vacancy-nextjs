import { Label } from "@/components/ui/label";
import Script from "@/components/Script";

interface JobFeaturedProps {
  formData: {
    featured?: boolean;
  };
  onFeaturedChange: (featured: boolean) => void;
}

const JobFeatured = ({ formData, onFeaturedChange }: JobFeaturedProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="block text-sm font-medium mb-2">Make this job posting "Featured"</Label>
        <p className="text-sm text-gray-500 mb-4">
        Support this platform whilst maximizing your job's visibility. 'Buy a Coffee' after posting and make your ad featured.      </p>
        <div className="flex items-center justify-center">
          <Script
            src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
            data-name="bmc-button"
            data-slug="riadjoseph"
            data-color="#FFDD00"
            data-emoji=""
            data-font="Cookie"
            data-text="Buy me a coffee"
            data-outline-color="#000000"
            data-font-color="#000000"
            data-coffee-color="#ffffff"
            onLoad={() => {
              // The button will be rendered by the script
              const button = document.querySelector('.bmc-button');
              if (button) {
                button.addEventListener('click', () => {
                  onFeaturedChange(true);
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default JobFeatured;