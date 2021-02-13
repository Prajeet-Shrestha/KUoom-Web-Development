export interface BookingRequestDataTempalte {
  reqId: string;
  RoomId: string;
  landLord: {
    email: string;
    phone: string;
  };
  TenantId: {
    email: string;
    id: string;
  };
  dateofBooking: Date | string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Withdrawn';
}
