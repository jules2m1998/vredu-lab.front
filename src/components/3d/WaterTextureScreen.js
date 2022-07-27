import {useCallback, useEffect, useRef, useState} from "react";
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {styled} from "@mui/material/styles";
import PropTypes from "prop-types";
import {Grid} from "@mui/material";
import ParamsLiquid from "./ParamsLiquid";
import {toServerPath} from "../../utils/string";

const Div = styled('div')(({radius}) => ({
	width: '100%',
	maxWidth: 400,
	height: "100%",
	minHeight: 300,
	borderRadius: radius,
	overflow: "hidden",
	background: 'rgba(42,52,129,0.45)'
}))

export default function WaterTextureScreen(
	{
		radius = 0,
		defaultValue,
		defaut,
	}
) {
	const [texturesFile, setTexturesFile] = useState(defaultValue);
	const [txLoader,] = useState(new THREE.TextureLoader())
	const [liquid, setLiquid] = useState(defaut?.textureType === 0);
	
	const animation = useRef(0)
	const divScene = useRef(null)
	const refractionMaterial = useRef(null)
	const sphere3D = useRef(null)
	
	const handleColorChange = useCallback((e) => {
		setTexturesFile(tf => ({...tf, color: e.rgb}))
		refractionMaterial.current.color.set(`rgb(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b})`)
		refractionMaterial.current.opacity = e.rgb.a
	}, []);
	
	const handleTextureChange = useCallback((name) => (file) => {
		setTexturesFile(tf => ({...tf, [name]: file}))
		refractionMaterial.current[name] = txLoader.load(URL.createObjectURL(file))
		if (name === "aoMap") {
			sphere3D.current.geometry.attributes.uv2 = sphere3D.current.geometry.attributes.uv
		}
	}, [txLoader]);
	
	const handlePropChange = useCallback((name) => (e, value) => {
		setTexturesFile(tf => ({...tf, [name]: value}))
		refractionMaterial.current[name] = value
	}, [])
	
	const loadData = useCallback(async () => {
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
		
		let map = {
			envMap: refractionCube,
			metalness: defaultValue.metalness, // metalic
			displacementScale: defaultValue.displacementScale,
			refractionRatio: .1,
			roughness: defaultValue.roughness, // rugosité
			side: THREE.DoubleSide,
		}
		
		if (defaut){
			map = Object.entries(defaultValue).reduce((acc, [key, v]) => {
				if (typeof v === 'string') return {
					...acc,
					[key]: txLoader.load(toServerPath(v))
				}
				return {
					...acc,
					[key]: v
				}
			}, {})
			console.log(map)
		}
		
		
		refractionMaterial.current = new THREE.MeshPhysicalMaterial({
			...map,
			color: defaultValue.color, // couleur
			transparent: true
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
	}, [defaultValue, defaut, liquid, txLoader])
	
	useEffect(() => {
		loadData()
		return () => {
			cancelAnimationFrame(animation.current)
		}
	}, [loadData]);
	
	return <Grid container spacing={2}>
		<Grid item xs={4}>
			<div>
				<Div radius={radius} ref={divScene}/>
			</div>
		</Grid>
		<Grid item xs={8}>
			<ParamsLiquid
				onColorChange={handleColorChange}
				onTextureChange={handleTextureChange}
				onPropChange={handlePropChange}
				textureFile={texturesFile}
				defaultValue={texturesFile}
				setState={setLiquid}
				liquid={liquid}
				name={defaut?.name}
				isUpdate={!!defaut}
				defaut={defaut}
			/>
		</Grid>
	</Grid>
}

WaterTextureScreen.propTypes = {
	radius: PropTypes.number,
	defaultValue: PropTypes.object,
	name: PropTypes.string,
	defaut: PropTypes.object,
};