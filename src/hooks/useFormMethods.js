import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useMemo} from "react";

export default function useFormMethods (fields){
	const defaultValues = useMemo(() => fields.map(item => ({
		[item.name]: item.default
	})).reduce((acc, current) => ({...acc, ...current}), {}), [fields])
	
	const schema = useMemo(() => Yup.object().shape(fields.map(item => ({
		[item.name]: item.schema
	})).reduce((acc, current) => ({...acc, ...current}), {})), [fields])
	
	return useForm({
		defaultValues,
		resolver: yupResolver(schema)
	})
}