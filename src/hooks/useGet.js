import {useCallback, useContext} from "react";
import {RequestContext} from "../http/RequestProvider";

export default function useGet(){
  const request = useContext(RequestContext);
	return useCallback(
		(url, msg = null) => {
			const params = {
				successMsg: msg
			}
			return request.fetch(url, {...params})
		},
		[request],
	);
}