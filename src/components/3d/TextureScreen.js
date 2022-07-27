import {styled} from "@mui/material/styles";
import {useEffect, useMemo, useRef} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import PropTypes from "prop-types";
import {toServerPath} from "../../utils/string";

const Div = styled('div')(({radius}) => ({
	width: '100%',
	maxWidth: 400,
	height: "100%",
	minHeight: 200,
	borderRadius: radius,
	overflow: "hidden",
	background: 'rgba(42,52,129,0.45)'
}))

const defV = {
	metalnessMap: null,
	metalness: .0,
	roughnessMap: null,
	roughness: 1.0,
	map: null,
	normalMap: null,
	displacementMap: null,
	displacementScale: .05,
	aoMap: null,
	color: 0xffffff
}

TextureScreen.propTypes = {
	texture: PropTypes.object.isRequired,
	liquid: PropTypes.bool.isRequired,
};

export default function TextureScreen({texture, liquid}) {
	const sceneDiv = useRef(null)
	const animation = useRef(0)
	const copyTexture = useMemo(() => ({
		...Object
			.keys(defV)
			.reduce((acc, current) => ({...acc, [current]: texture[current]}), {})
	}), [texture]);
	
	useEffect(() => {
		const {current: {offsetWidth, offsetHeight}} = sceneDiv
		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(75, offsetWidth / offsetHeight, .1, 1000)
		
		camera.position.z = -2.5
		camera.position.x = -5
		
		const ambient = new THREE.AmbientLight(0xffffff)
		scene.add(ambient)
		
		const renderer = new THREE.WebGL1Renderer()
		renderer.setSize(offsetWidth, offsetHeight)
		sceneDiv.current.innerHTML = ''
		
		cancelAnimationFrame(animation.current)
		sceneDiv.current.appendChild(renderer.domElement)
		
		let tooLazyToHandleLoadingProperty = 0
		const loadingCol = () => {
			tooLazyToHandleLoadingProperty += 1
		}
		const ENV_URL = "/lab.jpg"
		const reflectionCube = new THREE.TextureLoader().load(ENV_URL, loadingCol)
		
		reflectionCube.mapping = THREE.EquirectangularReflectionMapping
		scene.background = reflectionCube
		
		const geometry = new THREE.SphereGeometry(2, 128, 128)
		const base = geometry.attributes.position.array.slice()
		const txLoader = new THREE.TextureLoader();
		
		const refractionMaterial = new THREE.MeshPhysicalMaterial({
			...Object.entries(copyTexture).reduce((acc, [key, v]) => {
				if (typeof v === 'string') return {
					...acc,
					[key]: txLoader.load(toServerPath(v))
				}
				return {
					...acc,
					[key]: v
				}
			}, {}),
			envMap: reflectionCube,
			color: `rgb(${texture?.color?.r},${texture?.color?.g},${texture?.color?.b})`,
			opacity: texture?.color?.a,
			transparent: true
		})
		const sphere3D = new THREE.Mesh(geometry, refractionMaterial)
		const sphere = new THREE.Object3D()
		sphere.add(sphere3D)
		scene.add(sphere)
		sphere.lookAt(camera.position)
		camera.lookAt(sphere.position)
		
		const controls = new OrbitControls(camera, renderer.domElement)
		controls.enableDamping = true
		
		const animate = (dt) => {
			animation.current = requestAnimationFrame(animate)
			controls.update()
			if (tooLazyToHandleLoadingProperty !== 1) return
			if (liquid) geometry.attributes.position.array.forEach((val, i, arr) => {
				const place = i % 3
				if (place === 0) {
					arr[i] = base[i] + Math.sin(base[i + 1] * 3 + dt * .002) * .1
				} else if (place === 1) {
					arr[i] = base[i] + Math.cos(base[i - 1] * 5 + dt * .003) * .08
				} else if (place === 2) {
					arr[i] = base[i] + Math.sin(base[i - 2] * 25 + dt * .01) * .03
				}
			})
			geometry.computeVertexNormals()
			geometry.normalizeNormals()
			geometry.attributes.position.needsUpdate = true
			
			renderer.setSize(offsetWidth, offsetHeight)
			camera.aspect = offsetWidth / offsetHeight
			camera.updateProjectionMatrix()
			renderer.render(scene, camera)
		}
		
		animate()
		return () => {
			cancelAnimationFrame(animation.current)
		}
	}, [copyTexture, liquid, texture]);
	
	return <Div ref={sceneDiv}/>
}