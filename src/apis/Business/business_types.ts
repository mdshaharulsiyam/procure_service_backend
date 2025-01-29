import { Types } from "mongoose";

export interface IBusiness_service {
    service: Types.ObjectId[];
    category: Types.ObjectId;
    description: string;
    business_reg_no: string
    business_reg_no_document: string[]
}

export interface IBusiness_media {
    logo: string;
    img: string[]
}

export interface IBusiness_location {
    area: string;
    building: string;
    street_address: string;
    postal_code: string;
    service_area_limit: string;
    service_area_name: string;
}

export interface IBusiness extends Document {
    business_reg_no: string,
    is_verified: boolean;
    rating: number;
    total_rated: number;
    total_provided_service: number;
    auth: Types.ObjectId;
    business_phone_no: string;
    business_started_year: string;
    no_of_employee: number;
    website: string
    service: IBusiness_service;
    media: IBusiness_media;
    address: IBusiness_location
}