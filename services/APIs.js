const BASE_URL = import.meta.env.VITE_APP_BASE_URL;


export const APIendpoints = {
    CREATE_FORM: BASE_URL + "/form/createform",
    UPDATE_FORM: BASE_URL + "/form/updateform",
    GET_FORMDATA: BASE_URL + "/form/getformData",
    UPDATE_STEP:BASE_URL+"/form/updateStep",
    CREATE_STEP:BASE_URL+"/form/createStep",
    FILE_UPLOAD:BASE_URL+"/form/fileUpload",
    SUBMIT_RESPONSE:BASE_URL+"/form/submitResponse"

}