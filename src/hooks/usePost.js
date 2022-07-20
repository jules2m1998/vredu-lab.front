import {useCallback, useContext} from "react";
import {RequestContext} from "../http/RequestProvider";
import {HTTP_CONFIG} from "../http/request";

export default function usePost () {
	const request = useContext(RequestContext);
	
	return useCallback(
		(url, msg, {data}) => {
			const params = {
				method: 'post',
				successMsg: msg,
				body: data
			}
			
			if (data instanceof FormData){
				params.config = HTTP_CONFIG.FORM_DATA
			}
			
			return request.fetch(url, {...params})
		},
		[request],
	);
	
}