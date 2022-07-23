import {useCallback, useEffect, useRef, useState} from "react";
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {styled} from "@mui/material/styles";
import PropTypes from "prop-types";
import {Stack} from "@mui/material";
import ParamsLiquid from "./ParamsLiquid";

const Div = styled('div')(({radius}) => ({
	width: '100%',
	height: "100%",
	minHeight: 300,
	borderRadius: radius,
	overflow: "hidden",
	background: 'rgba(42,52,129,0.45)'
}))

export default function WaterTextureScreen({radius = 0, liquid = false}) {
	const [color, setColor] = useState({r: 238, g: 218, b: 218, a: 1});
	const [metalness, setMetalness] = useState(0);
	const [reflectivity, setReflectivity] = useState(0);
	const [roughness, setRoughness] = useState(0);
	const [texturesFile, setTexturesFile] = useState({displacementScale: 0});
	const [txLoader, ] = useState(new THREE.TextureLoader())
	
	const animation = useRef(0)
	const divScene = useRef(null)
	const refractionMaterial = useRef(null)
	const sphere3D = useRef(null)
	
	const handleMetalness = useCallback((e, v) => {
		setMetalness(v)
		refractionMaterial.current.metalness = v
	}, []);
	const handleReflectivity = useCallback((e, v) => {
		setReflectivity(v)
		refractionMaterial.current.reflectivity = v
	}, []);
	const handleRoughness = useCallback((e, v) => {
		setRoughness(v)
		refractionMaterial.current.roughness = v
	}, []);
	
	const handleColorChange = useCallback((e) => {
		setColor(e.rgb)
		refractionMaterial.current.color.set(`rgb(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b})`)
		refractionMaterial.current.opacity = e.rgb.a
	}, []);
	
	const handleTextureChange = useCallback((name) => (file) => {
		setTexturesFile(tf => ({...tf, [name]: file}))
		refractionMaterial.current[name] = txLoader.load(URL.createObjectURL(file))
		if (name === "aoMap"){
			sphere3D.current.geometry.attributes.uv2 = sphere3D.current.geometry.attributes.uv
		}
	}, [txLoader]);
	
	const handlePropChange = useCallback((name) => (e,value) => {
		setTexturesFile(tf => ({...tf, [name]: value}))
		refractionMaterial.current[name] = value
	}, [])
	
	useEffect(() => {
		const {current: {offsetWidth, offsetHeight}} = divScene
		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(75, offsetWidth / offsetHeight, .1, 1000)
		
		camera.position.z = -2.5
		camera.position.x = -5
		
		const ambient = new THREE.AmbientLight(0xffffff)
		scene.add(ambient)
		
		const renderer = new THREE.WebGL1Renderer()
		renderer.setSize(offsetWidth, offsetHeight)
		divScene.current.innerHTML = ''
		cancelAnimationFrame(animation.current)
		divScene.current.appendChild(renderer.domElement)
		
		let tooLazyToHandleLoadingProperty = 0
		const loadingCol = () => {
			tooLazyToHandleLoadingProperty += 1
		}
		const ENV_URL = "/lab.jpg"
		const reflectionCube = new THREE.TextureLoader().load(ENV_URL, loadingCol)
		const refractionCube = new THREE.TextureLoader().load(ENV_URL, loadingCol)
		reflectionCube.mapping = THREE.EquirectangularReflectionMapping
		refractionCube.mapping = THREE.EquirectangularReflectionMapping
		scene.background = reflectionCube
		scene.environment = reflectionCube
		
		
		const geometry = new THREE.SphereGeometry(2, 128, 128)
		const base = geometry.attributes.position.array.slice()
		refractionMaterial.current = new THREE.MeshPhysicalMaterial({
			color: 0xff0000, // couleur
			envMap: refractionCube,
			metalness: 1, // metalic
			reflectivity: 0,
			displacementScale: .05,
			refractionRatio: .1,
			roughness: 0, // rugosité
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 1 // opacity
		})
		
		sphere3D.current = new THREE.Mesh(geometry, refractionMaterial.current)
		const sphere = new THREE.Object3D()
		sphere.add(sphere3D.current)
		scene.add(sphere)
		sphere.lookAt(camera.position)
		camera.lookAt(sphere.position)
		
		const controls = new OrbitControls(camera, renderer.domElement)
		controls.enableDamping = true
		
		const animate = (dt) => {
			animation.current = requestAnimationFrame(animate)
			controls.update()
			if (tooLazyToHandleLoadingProperty !== 2) return
			
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
	}, [liquid]);
	
	return <Stack spacing={2}>
		<Div radius={radius} ref={divScene}/>
		<ParamsLiquid
			color={color}
			metalness={metalness}
			reflectivity={reflectivity}
			roughness={roughness}
			onColorChange={handleColorChange}
			onMetalnessChange={handleMetalness}
			onReflectivityChange={handleReflectivity}
			onRoughnessChange={handleRoughness}
			onTextureChange={handleTextureChange}
			onPropChange={handlePropChange}
			textureFile={texturesFile}
		/>
	</Stack>
}

WaterTextureScreen.propTypes = {
	radius: PropTypes.number,
	liquid: PropTypes.bool,
};