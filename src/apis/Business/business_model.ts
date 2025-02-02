import { model, Schema } from "mongoose";
import { IBusiness, IBusiness_location, IBusiness_media, IBusiness_service } from "./business_types";

const business_service_schema = new Schema<IBusiness_service>({
    service: {
        type: [Schema.Types.ObjectId],
        ref: 'service',
        required: [true, 'service is is required'],
        validate: [
            {
                validator: function (value: [Schema.Types.ObjectId]) {
                    return !value || value?.length <= 0
                },
                message: 'at least one service mandatory for a business profile'
            }
        ]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: [true, 'category is required']
    },
    description: {
        type: String,
        default: null
    },
}, { _id: false })

const business_media_schema = new Schema<IBusiness_media>({
    logo: {
        type: String,
        default: null
    },
    img: {
        type: [String],
        default: []
    }
}, { _id: false })

const business_address_schema = new Schema<IBusiness_location>({
    area: {
        type: String,
        required: [true, 'area is required']
    },
    building: {
        type: String,
        required: [true, 'building is required']
    },
    street_address: {
        type: String,
        required: [true, 'street address is required']
    },
    postal_code: {
        type: String,
        required: [true, 'postal code is required']
    },
    service_area_limit: {
        type: String,
        required: [true, 'service area limit is required']
    },
    service_area_name: {
        type: String,
        required: [true, 'service area name is required']
    }

})

const business_schema = new Schema<IBusiness>({
    business_reg_no: {
        type: String,
        unique: true,
        default: null
    },
    business_reg_document: {
        type: [String],
        default: []
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0,
        validate: [
            {
                validator: function (value: number) {
                    return Number(value) > 5
                },
                message: `message can't be more then 5`
            }
        ]
    },
    total_rated: {
        type: Number,
        default: 0
    },
    total_provided_service: {
        type: Number,
        default: 0
    },
    auth: {
        type: Schema.Types.ObjectId,
        required: [true, 'auth id is required'],
        ref: 'auth'
    },
    business_phone_no: {
        type: String,
        required: [true, 'business phone number is required']
    },
    business_started_year: {
        type: String,
        default: null
    },
    no_of_employee: {
        type: Number,
        default: 0
    },
    website: {
        type: String,
        default: null
    },
    services: {
        type: business_service_schema,
        required: [true, 'service info is required'],
        validate: [
            {
                validator: function (value: IBusiness_service) {
                    return Object.keys(value)?.length <= 0
                },
                message: 'service info is required'
            }
        ]
    },
    media: {
        type: business_media_schema,
        default: {}
    },
    address: {
        type: business_address_schema,
        required: [true, 'address is required'],
        validate: [
            {
                validator: function (value: IBusiness_location) {
                    return Object.keys(value)?.length <= 0
                },
                message: 'address is required'
            }
        ]
    },

}, { timestamps: true });

business_schema.index({ business_reg_no: 1, "services.category": 1, auth: 1 }, { unique: true });

export const business_model = model<IBusiness>('business', business_schema);