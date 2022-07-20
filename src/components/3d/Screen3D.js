import {styled} from "@mui/material/styles";
import {useCallback, useEffect, useRef, useState} from "react";
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import PropTypes from "prop-types";
import LoaderHash from "../Loaders/LoaderHash";

const Div = styled('div')(({hidden}) => ({
	width: '100%',
	minHeight: 300,
	visibility: hidden ? "hidden" : "visible"
}))

const Abs = styled('div')(() => ({
	width: '100%',
	position: "absolute",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	display: "flex",
	justifyItems: 'center',
	alignItems: "center",
	zIndex: 1000,
	background: "white"
}))

const Container = styled('div')(({theme,error}) => ({
	borderRadius: 8,
	overflow: "hidden",
	width: "100%",
	position: "relative",
	border: `1px solid ${!error ? "#0000001f" : theme.palette.error.main }`
}))

export default function Screen3D({file, error = null}) {
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState('');
	const divScene = useRef(null)
	
	const onLoadProgress = useCallback((xhr) => {
		const evolution = (xhr.loaded / xhr.total) * 100
		if (Number.isFinite(evolution)) {
			setProgress(`${Math.round(evolution)}%`)
		} else {
			setProgress(null)
		}
	}, []);
	
	const loadFile = useCallback(async () => {
		const scene = new THREE.Scene()
		
		setLoading(true)
		const loader = new GLTFLoader()
		try {
			const gltf = await loader.loadAsync(file, onLoadProgress)
			gltf.scene.traverse((child) => {
				if (child.isMesh) {
					const m = child
					m.receiveShadow = true
					m.castShadow = true
				}
				if (child.isLight) {
					const l = child
					l.castShadow = true
					l.shadow.bias = -0.003
					l.shadow.mapSize.width = 2048
					l.shadow.mapSize.height = 2048
				}
			})
			const bbox = new THREE.Box3().setFromObject(gltf.scene);
			const {x, y, } = bbox.getSize(new THREE.Vector3());
			
			const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 5);
			scene.add(light);
			setLoading(false)
			
			const {current: {offsetWidth, offsetHeight}} = divScene
			const camera = new THREE.PerspectiveCamera(
				75,
				offsetWidth / offsetWidth,
				0.1,
				1000
			)
			const ratio = 1.5
			camera.position.set(x * ratio, y * ratio, 0)
			
			const renderer = new THREE.WebGLRenderer({alpha: true})
			renderer.physicallyCorrectLights = true
			renderer.shadowMap.enabled = true
			renderer.outputEncoding = THREE.sRGBEncoding
			renderer.setSize(offsetWidth, offsetHeight)
			renderer.setClearColor(0x000000, 0)
			scene.add(gltf.scene)
			divScene.current.innerHTML = ''
			divScene.current.appendChild(renderer.domElement)
			
			
			const controls = new OrbitControls(camera, renderer.domElement)
			controls.enableDamping = true
			
			const render = () => {
				renderer.render(scene, camera)
			}
			const onWindowResize = () => {
				camera.aspect = offsetWidth / offsetHeight
				camera.updateProjectionMatrix()
				renderer.setSize(offsetWidth, offsetHeight)
				render()
			}
			window.addEventListener('resize', onWindowResize, false)
			const animate = () => {
				requestAnimationFrame(animate)
				controls.update()
				render()
			}
			animate()
			return true
		} catch (e) {
			return e
		}
	}, [file, onLoadProgress]);
	
	useEffect(() => {
		loadFile().then(console.log)
	}, [loadFile]);
	
	return <Container error={error}>
		<Div ref={divScene}/>
		{loading && <Abs><LoaderHash text={progress}/></Abs>}
	</Container>
}

Screen3D.propTypes = {
	file: PropTypes.string.isRequired,
	error: PropTypes.string,
};