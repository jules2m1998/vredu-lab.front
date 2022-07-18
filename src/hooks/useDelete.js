import {useCallback, useContext} from "react";
import {RequestContext} from "../http/RequestProvider";


export default function useDelete(){
  const request = useContext(RequestContext);
	return useCallback(
		(url, msg) => {
			const params = {
				method: 'delete',
				successMsg: msg
			}
			
			return request.fetch(url, {...params})
		},
		[request],
	);
}