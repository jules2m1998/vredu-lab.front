import axios from "./axios";

const showError = (e, defaultError = "", snack = null, error = null, handleUnauthorized = () => {}) => {
    const {response: {data: {errors}, status}} = e
    if (snack) {
        if (errors) {
            const er = Object.entries(errors).reduce((accumulateur, valeurCourante) => {
                const current = Array.isArray(valeurCourante[1]) ? valeurCourante[1] : [valeurCourante[1]]
                return [...accumulateur, ...current]
            }, [])
            er.forEach((e) => snack(e, {variant: "error"}))
        } else if (status === 404) {
            snack("Element introuvable !", {variant: "error"})
        } else if (status === 401) {
            handleUnauthorized()
            snack("Vous ne pouvez pas effectuer cette action !", {variant: "error"})
        } else {
            const eltMsg = error?.filter(h => h.status === status)[0]
            snack(eltMsg ? eltMsg.msg : defaultError, {variant: "error"})
        }
    }
}

export const post = async (url, {
    form,
    snack = null,
    errorMsg = null,
    msg = null,
    handleUnauthorized = () => null
} = null) => {
    try {
        const res = await axios.post(url, form);
        const {data} = res
        if (snack) {
            snack(msg || "Success !", {variant: "success"})
        }
        return data;
    } catch (e) {
        showError(e, "Vous n'etes pas autorise a effectuer cette action !", snack, errorMsg, handleUnauthorized)
        return null
    }
}


export const get = async (url, {
    method = "get",
    snack = null,
    errorMsg = null,
    msg = null,
    isSuccess = false,
    handleUnauthorized = () => null
} = null) => {
    try {
        const {data} = await axios[method](url)
        if (snack && isSuccess) {
            snack(msg || "Success !", {variant: "success"})
        }
        return data

    } catch (e) {
        showError(e, "Element introuvable !", snack, errorMsg, handleUnauthorized)
        return null
    }
}