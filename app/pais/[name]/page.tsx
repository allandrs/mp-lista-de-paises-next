import type { Country } from "@/app/page";
import Link from "next/link";
import Image from "next/image";
import CountryCard from "@/components/country-card";

async function getCountryByName(name: string): Promise<Country> {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries: Country[] = await response.json();
    
    return countries.find((country: Country) => country.name.common === name)!;
}

async function getCountryBordersByName(name: string) {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries: Country[] = await response.json();
    
    const country = countries.find((country: Country) => country.name.common === name)!;

    return country.borders?.map(border => {
        const borderCountry = countries.find(country => country.cca3 === border)!

        return {
            name: borderCountry.name.common,
            ptName: borderCountry.translations.por.common,
            flag: borderCountry.flags.svg,
            flagAlt: borderCountry.flags.alt,
        };
    });
}

export default async function CountryPage({ 
    params: { name },
}: { 
    params: {name: string};
}) {
    const country = await getCountryByName(decodeURI(name));
    const borderCountries = await getCountryBordersByName(decodeURI(name));


    const formatter = Intl.NumberFormat("en", { notation: "compact" })

    return (
    <section className="flex flex-col container">
        <h1 className="text-5xl text-center font-bold text-gray-800 my-16">
            {country.translations.por.common}
        </h1>
        <Link href="/" className="flex items-center py-2">
            <Image 
                src="/arrow-back.png" 
                alt="Ícone de seta de voltar" 
                width={24} 
                height={24}
            />
            voltar
        </Link>
        <article className="flex justify-between md:flex-row flex-col min-w-full p-8 bg-white rounded-xl">
            <section>
                {country.capital && <h2 className="text-xl text-gray-800">
                    <b>🏙️ Capital:</b> - {country.capital}
                </h2>}
                <h2 className="text-xl text-gray-800">
                    <b>🗺️ Continente:</b> - {country.region} {country.subregion && - `${country.subregion}`}
                </h2>
                <h2 className="text-xl text-gray-800">
                    <b>👨‍👩‍👧‍👦 População:</b> - {formatter.format(country.population)}
                </h2>
                {country.languages &&(
                <h2 className="text-xl text-gray-800">    
                    <b>🗣️ Línguas faladas:</b> 
                    <br/>
                    {Object.values(country.languages).map((language) => (
                        
                        <span 
                        key={language} 
                        className="inline-block px-2 bg-indigo-700 mr-2 text-white text-sm rounded-full">{language}
                        </span>
                    ))}
                </h2>
                )}
            </section>
            <div className="relative h-48 md:h-auto my-2 md:order-last order-first w-96 shadow-md">   
                <Image 
                    src={country.flags.svg}
                    alt={country.flags.alt} 
                    fill
                    className="object-cover"
                />
            </div>
        </article>
        <section>
            <h3 className="text-2xl font-semibold text-gray-800 my-3">Países que fazem fronteira</h3>
        </section>
        <div className="grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 w-full container">
            {borderCountries?.map((border) =>  (
                <CountryCard
                    key={country.name.common}
                    name={country.name.common}
                    ptName={country.translations.por.common}
                    flag={country.flags.svg}
                    flagAlt={country.flags.alt}
                />
        ))}
        

        </div>
    </section>
    )
}