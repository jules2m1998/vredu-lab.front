import {styled} from "@mui/material/styles";
import PropTypes from "prop-types";
import {cloneElement, useCallback, useRef} from "react";
import {useSprings, animated, to} from "react-spring";
import {useGesture} from "react-with-gesture";
import clamp from "lodash-es/clamp";
import swap from 'lodash-move'
import {List} from "@mui/material";

const Div = styled(List)(({width, height}) => ({
	width: width || "100%",
	position: 'relative',
	height: height || 100
}))

export default function DragAndDrop({items, item, onOrderChange, itemSize = 100, gap = 5}) {
	const order = useRef(items.map((_, index) => index))
	const bind = useGesture(({args: [originalIndex], down, delta: [, y]}) => {
		const curIndex = order.current.indexOf(originalIndex)
		const curRow = clamp(Math.round((curIndex * itemSize + y) / 100), 0, items.length - 1)
		const newOrder = swap(order.current, curIndex, curRow)
		setSprings(fn(newOrder, down, originalIndex, curIndex, y))
		if (!down) order.current = newOrder
	})
	
	const fn = useCallback((order, down, originalIndex, curIndex, y) => index =>
		down && index === originalIndex
			?	{y: curIndex * itemSize + y, zIndex: '1', shadow: 15, immediate: n => n === 'y' || n === 'zIndex'}
			: {y: order.indexOf(index) * itemSize, zIndex: '0', shadow: 1, immediate: false}, [itemSize]);
	
	const [springs, setSprings] = useSprings(items.length, fn(order.current))
	
	return <Div height={items.length * itemSize}>
		{
			springs.map(({zIndex, y, scale}, i) => (
				<animated.div
					{...bind(i)}
					key={i}
					style={{
						zIndex,
						transform: to([y, scale], (y) => `translate3d(0,${y}px,0)`),
						height: itemSize - gap,
						position: "absolute"
					}}
				>
					{
						cloneElement(item, {item: items[i]}, null)
					}
				</animated.div>
			))
		}
	</Div>
}

DragAndDrop.propTypes = {
	items: PropTypes.array,
	item: PropTypes.node,
	onOrderChange: PropTypes.func,
	itemSize: PropTypes.number,
	gap: PropTypes.number,
}