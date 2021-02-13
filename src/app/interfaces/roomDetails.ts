export interface roomDetailsTemplate {
  id: string | any;
  policies: [] | null;
  basicQA: [] | null;
  capacity: number | string;
  description: string | null;
  location: string;
  isAvailable: boolean;
  roomType: string;
  availableDate: {
    dateObject: Date | string;
    YYYYMMDD: string;
  } | null;
  landLordDetails: {
    fullName: string;
    email: string | null;
    phone: string;
    isTrusted: boolean;
    img: string | null;
  } | null;
  isBooked: boolean;
  facilities: [] | {};

  feeDetails: { price: number | string };

  images: {
    mainPhoto: string | object;
    extras: [] | null;
  };

  furnishedDetails: {
    isFurnished: boolean;
    objects: [] | null | {};
  } | null;
}
