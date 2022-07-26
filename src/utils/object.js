import {filter} from "lodash";

export function getDiff (obj1, obj2, upper = false) {
    return Object.entries(obj1).reduce((acc, [k, v]) => {
        const value = typeof v === 'string' ? v.trim() : v
        const comp = typeof obj2[k] === 'string' ? obj2[k].trim() : obj2[k]
        if (value === comp) return {...acc}
        return {...acc, [upper ? k.charAt(0).toUpperCase() + k.slice(1) : k] : value}
    }, {})
}

export function toSameAttr(same, different){
	return Object.keys(same).reduce((acc, current) => ({...acc, [current]: different[current]}), {})
}

export function toFormData(obj){
    const formData = new FormData()
    Object.entries(obj).forEach(([k, v]) => formData.append(k,v))
    return formData
}

export function applySortFilter(array, comparator, query) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	if (query) {
		return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
	}
	return stabilizedThis.map((el) => el[0]);
}

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

export function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

export function toUpper(obj) {
	return Object.entries(obj).reduce((acc, [k, v]) => ({...acc, [k.charAt(0).toUpperCase() + k.slice(1)]: v}), {})
}