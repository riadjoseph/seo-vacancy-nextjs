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
import { useState } from "react";

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
  France: ['Rennes', 'Reims', 'Toulon', 'Angers', 'Dijon', 'Grenoble', 'Saint-Étienne', 'Clermont-Ferrand', 'Brest', 'Le Havre', 'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
  Spain: ['Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'La Coruña', 'Santander', 'Pamplona', 'Cádiz', 'Salamanca', 'Almería', 'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Bilbao', 'Alicante', 'Granada', 'Palma'],
  Germany: ['Bremen', 'Hanover', 'Nuremberg', 'Dresden', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Mannheim', 'Karlsruhe', 'Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen'],
  Italy: ['Verona', 'Messina', 'Padua', 'Trieste', 'Taranto', 'Brescia', 'Prato', 'Parma', 'Modena', 'Reggio Calabria', 'Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Venice'],
  Belgium: ['Namur', 'Mons', 'Hasselt', 'Mechelen', 'Kortrijk', 'Tournai', 'Brussels', 'Leuven', 'Antwerp', 'Ghent', 'Bruges', 'Liège'],
  Switzerland: ['Lugano', 'Winterthur', 'Lucerne', 'St. Gallen', 'Thun', 'Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern'],
  Netherlands: ['Haarlem', 'Groningen', 'Nijmegen', 'Maastricht', 'Amersfoort', 'Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
  Denmark: ['Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde', 'Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg'],
  Sweden: ['Linköping', 'Örebro', 'Helsingborg', 'Jönköping', 'Norrköping', 'Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås'],
  Norway: ['Kristiansand', 'Drammen', 'Fredrikstad', 'Ålesund', 'Bodø', 'Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Tromsø'],
  Finland: ['Jyväskylä', 'Kuopio', 'Lahti', 'Pori', 'Lappeenranta', 'Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu']
} as const;

const JobBasicInfo = ({ formData, handleChange, handleCityChange, errors = {} }: JobBasicInfoProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const availableCountries = Object.keys(CITIES_BY_COUNTRY).filter(country => country !== 'Remote');

  // Filter cities based on search term
  const filteredCities = Object.entries(CITIES_BY_COUNTRY).reduce((acc, [country, cities]) => {
    const matchedCities = cities.filter(city => 
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (matchedCities.length > 0) {
      acc[country] = matchedCities;
    }
    return acc;
  }, {} as typeof CITIES_BY_COUNTRY);

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
        <p className="text-sm text-gray-500 mb-2">Choose the city closest to the job location or select Remote when applicable.</p>
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
            <div className="px-3 py-2 border-b">
              <Input
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            {Object.entries(filteredCities).map(([country, cities]) => (
              <SelectGroup key={country}>
                <SelectLabel>{country}</SelectLabel>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
            {Object.keys(filteredCities).length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No cities found
              </div>
            )}
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