import axios from "./axios";

const showError = (e, defaultError = "", snack = null, error = null) => {
    if (snack) {
        const {status} = e.response
        const eltMsg = error?.filter(h => h.status === status)[0]
        snack(eltMsg ? eltMsg.msg : defaultError, {variant: "error"})
    }
}

export const post = async (url, form, snack = null, errorMsg = null, msg = null) => {
    try {
        const res = await axios.post(url, form);
        const {data} = res
        if (snack) {
            snack(msg || "Success !", {variant: "success"})
        }
        return data;
    } catch (e) {
        showError(e, "Vous n'etes pas autorise a effectuer cette action !", snack, errorMsg)
        return null
    }
}


export const get = async (url, method = "get", snack = null, errorMsg = null, msg = null) => {
    try {
        const {data} = await axios[method](url)
        if (snack) {
            snack(msg || "Success !", {variant: "success"})
        }
        return data

    } catch (e) {
        showError(e, "Element introuvable !", snack, errorMsg)
    }
}