import Image from "next/image";

export type Country = {
  name: {
    common: string;
  };

  translations: {
    por: {
      common: string;
    };
  };

  flags: {
    svg: string;
    alt: string;
  };

  capital: string;
  region: string;
  subregion: string;
  population: number;
  languages?: {
    [key: string]: string;
  };

  borders?: string[];
  cca3: string;
};

async function getCountries(): Promise<Country[]> {
  const response = await fetch("https://restcountries.com/v3.1/all");
  return response.json();
}

export default async function Home() {
  const countries = await getCountries();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full container gap-2 mt-16 ">
      {countries.map((country) => (
        <article
            className="h64 min-w-full p-2 bg-white border-2 rounded-xl hover:boder-indigo-200 transition-all hover:shadow-xl"
            key={country.name.common}
        >
            <div className="relative w-full h-40 p-2 overflow-hidden rounded-xl" >
                <Image
                    src={country.flags.svg}
                    alt={country.flags.alt}
                    fill
                    className="object-cover"
                />
            </div>
            <h1>{country.translations.por.common}</h1>
        </article>
      ))}
    </section>
  );
}