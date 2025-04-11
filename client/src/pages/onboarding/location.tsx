import { useOnboardingStore } from "@/lib/onboarding-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Language {
  id: string;
  name: string;
}

const countries = [
  { id: "US", name: "United States" },
  { id: "CA", name: "Canada" },
  { id: "IN", name: "India" },
  { id: "UK", name: "United Kingdom" },
  { id: "AU", name: "Australia" },
  { id: "DE", name: "Germany" },
  { id: "FR", name: "France" },
  { id: "JP", name: "Japan" },
  { id: "BR", name: "Brazil" },
  { id: "MX", name: "Mexico" },
];

const languages: Language[] = [
  { id: "english", name: "English" },
  { id: "spanish", name: "Spanish" },
  { id: "hindi", name: "Hindi" },
  { id: "french", name: "French" },
  { id: "german", name: "German" },
];

export default function LocationPage() {
  const { country, languages: selectedLanguages, setCountry, setLanguages } = useOnboardingStore();

  const toggleLanguage = (languageId: string) => {
    if (selectedLanguages.includes(languageId)) {
      setLanguages(selectedLanguages.filter(id => id !== languageId));
    } else {
      setLanguages([...selectedLanguages, languageId]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-3">Where are you from?</h2>
      <p className="text-neutral-600 mb-8">Which language do you prefer to speak in?</p>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="countrySelect" className="block text-sm font-medium text-neutral-700 mb-2">Country</Label>
          <Select 
            value={country} 
            onValueChange={setCountry}
          >
            <SelectTrigger id="countrySelect" className="w-full px-4 py-3">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(country => (
                <SelectItem key={country.id} value={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-neutral-700 mb-2">Language Preferences</Label>
          <div className="space-y-3">
            {languages.map(language => (
              <div key={language.id} className="flex items-center">
                <Checkbox 
                  id={`lang-${language.id}`} 
                  checked={selectedLanguages.includes(language.id)}
                  onCheckedChange={() => toggleLanguage(language.id)}
                  className="mr-2"
                />
                <Label 
                  htmlFor={`lang-${language.id}`} 
                  className="ml-2 text-neutral-700"
                >
                  {language.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
