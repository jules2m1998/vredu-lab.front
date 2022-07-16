/**
 *
 * @param items
 * @returns {Array}
 */
export const getLisItem = (items) => {
	if (!Array.isArray(items[0]?.data)) return items
	
	return items.reduce((acc, val) => [...acc, ...val.data], [])
}


/**
 *
 * @param arr {Array}
 * @param remove {Array}
 * @return {Array}
 */
export function removeArrayWithId(arr, remove){
	return [...arr.filter(i => remove.indexOf(i.id) < 0)]
}