import { UqbarType } from "./UqbarType";

export interface FormField { value: string, type: UqbarType }
export interface FormValues { [key: string]: FormField }
