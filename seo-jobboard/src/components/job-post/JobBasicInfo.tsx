import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobBasicInfoProps {
  formData: {
    title: string;
    company_name: string;
    company_logo: string;
    city: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCityChange: (value: string) => void;
  errors?: Record<string, string>;
}

export const CITIES_BY_COUNTRY = {
  Remote: ['Remote'],
  France: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
  Spain: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Bilbao', 'Alicante', 'Granada', 'Palma'],
  Germany: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen'],
  Italy: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Venice'],
  Belgium: ['Brussels', 'Antwerp', 'Ghent', 'Bruges', 'Liège'],
  Switzerland: ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern'],
  Netherlands: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
  Denmark: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg'],
  Sweden: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås'],
  Norway: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Tromsø'],
  Finland: ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu'],
} as const;

const JobBasicInfo = ({ formData, handleChange, handleCityChange, errors = {} }: JobBasicInfoProps) => {
  const availableCountries = Object.keys(CITIES_BY_COUNTRY).filter(country => country !== 'Remote');

  return (
    <>
      <div>
        <Label className="block text-sm font-medium mb-2">Job Title</Label>
        <Input
          required
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <Label className="block text-sm font-medium mb-2">Hiring Company Name</Label>
        <Input
          required
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          className={errors.company_name ? "border-red-500" : ""}
        />
        {errors.company_name && (
          <p className="text-sm text-red-500 mt-1">{errors.company_name}</p>
        )}
      </div>

      <div>
        <Label className="block text-sm font-medium mb-2">Company Logo URL</Label>
        <Input
          name="company_logo"
          value={formData.company_logo}
          onChange={handleChange}
          placeholder="https://..."
          className={errors.company_logo ? "border-red-500" : ""}
        />
        {errors.company_logo && (
          <p className="text-sm text-red-500 mt-1">{errors.company_logo}</p>
        )}
      </div>

      <div>
        <Label className="block text-sm font-medium mb-2">Location</Label>
        <p className="text-sm text-gray-500 mb-2">Choose the city closest to the job location or select if Remote.</p>
        <p className="text-sm text-gray-500 mb-2">Available countries: {availableCountries.join(', ')}.</p>
        <Select
          required
          value={formData.city}
          onValueChange={handleCityChange}
        >
          <SelectTrigger className={errors.city ? "border-red-500" : ""}>
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CITIES_BY_COUNTRY).map(([country, cities]) => (
              <SelectGroup key={country}>
                <SelectLabel>{country}</SelectLabel>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        {errors.city && (
          <p className="text-sm text-red-500 mt-1">{errors.city}</p>
        )}
      </div>
    </>
  );
};

export default JobBasicInfo;