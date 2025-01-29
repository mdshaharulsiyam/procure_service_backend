import { Types } from "mongoose"

export interface IService {
    name: string
    img: string
    category: Types.ObjectId
}