export const urlValidation = (value: string) => {
	/* eslint-disable-next-line */
	const urlValidation =
		/^$|^((ftp|http|https):\/\/)?(www\.)?([\w$+!*'(),#%{}|\\^~[\]`<>-]+(\.[\w$+!*'(),#%{}|\\^~[\]`<>-]+)+)(\/[\w$+!*'(),#%{}|\\^~[\]`<>.-]*)*(\?[\w$+!*'(),#%{}|\\^~[\]`<>-]+=[^&=]+(&[\w$+!*'(),#%{}|\\^~[\]`<>-]+=[^&=]+)*)?$/im;
	return urlValidation.test(value);
};

export const restrictSpacesAfterPeriod = (number: number, spaces = 2) => {
	const splitNumber = String(number).split(".");
	if (splitNumber.length > 2) {
		return false;
	}

	if (splitNumber.length === 2 && splitNumber[1].length > +spaces) {
		return false;
	}

	return true;
};

export const isIPAddress = (value: string) => {
	const ipV46Regex =
		/(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)/gm;
	return ipV46Regex.test(value || "");
};


export const validExtensions: Record<string, string[]> = {
    "image/jpeg": ["jpg", "jpeg", "jfif", "pjpeg", "pjp"],
    "image/png": ["png"],
    "image/svg+xml": ["svg"],
    "application/pdf": ["pdf"],
    "application/msword": ["doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],
    "application/vnd.ms-excel": ["xls"],
    "text/csv": ["csv"],
    "application/json": ["json"],
};

export const getDisplayName = ({ firstName, lastName }: { firstName: string | null, lastName: string | null }) => {
    if (!firstName && !lastName) {
        return;
    }
    let displayName = "";
    if (firstName) {
        displayName += firstName;
        if (lastName) {
            displayName += " ";
        }
    }
    if (lastName) {
        displayName += lastName;
    }
    return displayName;
};