declare module "amadeus" {
  interface AmadeusOptions {
    clientId: string;
    clientSecret: string;
    hostname?: string;
  }

  class Amadeus {
    constructor(options: AmadeusOptions);
    shopping: Record<string, unknown>;
    referenceData: {
      locations: Record<string, unknown>;
    };
  }

  export default Amadeus;
}
