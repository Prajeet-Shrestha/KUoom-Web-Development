export interface roomDetailsTemplate {
  id: string | any;
  policies:
    | [
        {
          policies: string;
        }
      ]
    | null;
  basicQA: [] | null;
  capacity: number | string;
  description: string | null;
  isChecked: boolean;
  location: {
    name: string;
    url: string;
  };
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
  // isBooked: boolean;
  facilities: {
    AC: boolean | false;
    laundary: boolean | false;
    terrance: boolean | false;
    wifi: boolean | false;
  };

  feeDetails: {
    price: number | string;
    electricBill: boolean | false;
    laundary: boolean | false;
    meals: boolean | false;
    roomSpace: boolean | false;
    wifi: boolean | false;
  };

  images: {
    mainPhoto: string | object;
    extras: [] | null | any;
  };

  furnishedDetails: {
    isFurnished: boolean;
    objects: {
      hasBed: boolean;
      hasDesk: boolean;
      hasChair: boolean;
      hasCupBoard: boolean;
    };
  } | null;
}
