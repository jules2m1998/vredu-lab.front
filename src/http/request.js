import axios from "./axios";

export default class Fetch{

    constructor(snack, handleUnauthorized) {
        this.snack = snack
        this.handleUnauthorized = handleUnauthorized
    }

    async fetch(url, { method = "get", body = null, defaultErrorMsg =  "", errorObject = {}, successMsg = null, isShowError = true} = {}){
        try {
            const {data} = !body || method === "get" ? await axios[method](url) : await axios[method](url, body)
            if (successMsg){
                this.snack(successMsg, {variant: "success"})
            }
            return data
        } catch (e) {
            this.handleErrors(e, {
                defaultError:  defaultErrorMsg,
                isShowError,
                error: errorObject
            })
            return null
        }
    }

    handleErrors(e, { defaultError = "", error = null, isShowError = true }){
        const {response: {data: {errors}, status}} = e

        if (errors){
            const er = Object.entries(errors).reduce((accumulateur, valeurCourante) => {
                const current = Array.isArray(valeurCourante[1]) ? valeurCourante[1] : [valeurCourante[1]]
                return [...accumulateur, ...current]
            }, [])
            if (isShowError) er.forEach((e) => this.snack(e, {variant: "error"}))
        } else if (status  === 404 && isShowError) {
            this.snack("Element introuvable !", {variant: "error"})
        } else if (status === 401){
            this.handleUnauthorized()
            console.log(status)
            if (isShowError) this.snack("Vous ne pouvez pas effectuer cette action !", {variant: "error"})
        } else if (isShowError) {
            const eltMsg = error?.filter(h => h.status === status)[0]
            this.snack(eltMsg ? eltMsg.msg  : defaultError, {variant: "error"})
        }
    }
}