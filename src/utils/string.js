import {BASE_URL} from "./const";

export function toServerPath(path) {
	return path.startsWith("/") ? BASE_URL + path : `${BASE_URL}/${path}`
}

export function tryParseInt(str) {
	let retValue = -1;
	if(str !== null) {
         if(str.length > 0) {
             if (!Number.isNaN(str)) {
                 retValue = parseInt(str, 10);
             }
         }
     }
     return retValue;
}