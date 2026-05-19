import { ValueTypesEnum } from "../enums";


export const user = [
    { name: "firstName", displayName: "First Name", internalName: "first_name", type: ValueTypesEnum.STRING, sortable: true, filterable: false, searchable: true, required: false },

    { name: "lastName", displayName: "Last Name", internalName: "lastname", type: ValueTypesEnum.STRING, sortable: true, filterable: false, searchable: true, required: false },

    { name: "displayName", displayName: "Display Name", internalName: "display_name", type: ValueTypesEnum.STRING, sortable: true, filterable: false, searchable: true, required: false },

    { name: "email", displayName: "Email", internalName: "email", type: ValueTypesEnum.STRING, sortable: true, filterable: false, searchable: true, required: false },

    { name: "role", displayName: "Role", internalName: "role", type: ValueTypesEnum.STRING, sortable: true, filterable: true, searchable: true, required: false },

    { name: "isEnabled", displayName: "Status (Active)", internalName: "is_enabled", type: ValueTypesEnum.BOOLEAN, sortable: false, filterable: true, searchable: false, required: false },

    { name: "isEmailVerified", displayName: "Email Verified (Status)", internalName: "is_email_verified", type: ValueTypesEnum.BOOLEAN, sortable: false, filterable: true, searchable: false, required: false },

    { name: "emailVerifiedAt", displayName: "Email Verified Time", internalName: "email_verified_at", type: ValueTypesEnum.DATE, sortable: true, filterable: false, searchable: false, required: false },

    { name: "createdAt", displayName: "Created Time", internalName: "created_at", type: ValueTypesEnum.DATE, sortable: true, filterable: true, searchable: false, required: false },

    { name: "updatedAt", displayName: "Updated Time", internalName: "updated_at", type: ValueTypesEnum.DATE, sortable: true, filterable: true, searchable: false, required: false },
];

// Tolerance for floating-point comparison
export const FLOAT_TOLERANCE = 0.000001;

export const VALID_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export const VALID_ACTIONS = ['CREATE', 'UPDATE', 'DELETE', 'READ', 'LOGIN', 'LOGOUT', 'SEND_OTP', 'VERIFY_EMAIL'];
