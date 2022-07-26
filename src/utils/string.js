import {BASE_URL} from "./const";

export function toServerPath(path) {
	return path.startsWith("/") ? BASE_URL + path : `${BASE_URL}/${path}`
}