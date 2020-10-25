export interface UserDetails {
    name:string | null;
    imgUrl:string | null;
    email:string | null;
    phone: string | null;
    userType: 'Tenant' | 'Landlord' | null;
    uid: string | null;
    gender: 'm' | 'male' | 'female' | 'f' | null | 'n/a';    
}
