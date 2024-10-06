
const superAdmin = {
    username: 'oksana.mardak@vitechteam.com',
    pass: 'Oksana7773@'
}

const user = {
    username: 'goyan1997+3@gmail.com',
    pass: '123qweasd',
    orgId: '6cbaaf0d-d702-482e-8603-b6804200ae48',
    fieldId: '654636fb-a197-4f7c-970a-d8012bf012ff',
    fieldsId: ['0b6f517f-d04e-4012-a75a-f6e186af5dd4', '6cbaaf0d-d702-482e-8603-b6804200ae48', '02c585ae-c19e-4885-937a-ae9a45011c07'],
    exportedFields: '"Name","Crop Water Use (mm)","Soil water content (mm)","Risk of nutrients loss (%)","Risk of water shortage (%)","Expected rain (mm)","Crop Water Use Forecast (mm)","Soil water content Forecast (mm)","Risk of nutrients loss Forecast (%)","Risk of water shortage Forecast (%)"\n"safrinha_br_2(A)","1","304","0","0","0","0","294","6","0"\n"safrinha_br_3","1","304","0","0","0","0","294","6","0"\n"safrinha_br_4","1","304","0","0","0","0","294","6","0"\n'
};

const admin2 = {
    firstName: 'Lucas',
    lastName: 'Silbva',
    username: 'nadia.sokolan@vitechteam.com',
    pass: '123qweASD!',
    orgId: '0e9aa68f-47ee-4297-95f1-5527cca58974'
};

export const creds = {
    superAdmin :superAdmin,
    user: user,
    admin2: admin2,
}

export const apiUserCreds = {
    client_id: '7dpf3thq8hudakipbgejq8vec2',
    client_secret: 'r89ssjb4fbhf36ljpfckj9vff3q3pcraas48d38q2r403ugk3s0' // do not use production secret , refactor this to use env variables
}
