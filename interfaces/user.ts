import { LoggedInDevices } from "./logged-in-devices";
import { ReferenceValue } from "./reference-value";

export interface UserRow {
    id: string;
    first_name: string;
    last_name: string;
    display_name: string;
    email: string;
    password: string;
    is_password_set?: boolean;
    phone_number?: string;
    address?: string;
    role: string;
    entity_id?: string;
    profile_picture?: string;
    is_enabled: boolean;
    is_email_verified: boolean;
    email_verified_at?: Date;
    otp?: string | null;
    otp_expiry?: Date | null;
    token?: string | null;
    token_expiry?: Date | null;
    permissions: string[];
    logged_in_devices?: LoggedInDevices[];
    created_at: Date;
    updated_at?: Date;
    created_by: ReferenceValue;
    updated_by?: ReferenceValue;
}
