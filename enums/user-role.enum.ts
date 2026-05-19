export enum UserRole {
    SuperAdmin = "super_admin",
    Admin = "admin",
    Feeder = "feeder",
    Consumer = "consumer"
};

export const validSortFields = {
    name: 'name',
    title: 'title',

    numberOfConsumers: 'number_of_consumers',
    city: 'city',
    state: 'state',

    fatherName: 'father_name',
    consumerNumber: 'consumer_number',
    numberOfInverters: 'number_of_inverters',
    installationDate: 'installation_date',
    plantDegradationRate: 'plant_degradation_rate',
    otherLosses: 'other_losses',

    latitude: 'latitude',
    longitude: 'longitude',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
};

export const validFilterFields = [
    'installationStartDate',
    'installationEndDate',
    'installationDate',
    'isSolarPanelInstalled',

    'city',
    'state',
    'numberOfConsumers'
];
