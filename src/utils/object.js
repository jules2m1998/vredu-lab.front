
export function getDiff (obj1, obj2, upper = false) {
    return Object.entries(obj1).reduce((acc, [k, v]) => {
        const value = typeof v === 'string' ? v.trim() : v
        const comp = typeof obj2[k] === 'string' ? obj2[k].trim() : obj2[k]
        if (value === comp) return {...acc}
        return {...acc, [upper ? k.charAt(0).toUpperCase() + k.slice(1) : k] : value}
    }, {})
}

export function toFormData(obj){
    const formData = new FormData()
    Object.entries(obj).forEach(([k, v]) => formData.append(k,v))
    return formData
}