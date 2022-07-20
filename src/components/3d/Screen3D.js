import {styled} from "@mui/material/styles";
import {useEffect, useRef} from "react";
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import PropTypes from "prop-types";

const Div = styled('div')(() => ({
	width: '100%',
	minHeight: 300
}))

export default function Screen3D({file}) {
	const divScene = useRef(null)
	
	useEffect(() => {
		const {current: {offsetWidth, offsetHeight}} = divScene
		const scene = new THREE.Scene()
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 10);
		scene.add(light);
		
		const camera = new THREE.PerspectiveCamera(
			75,
			offsetWidth / offsetWidth,
			0.1,
			1000
		)
		camera.position.z = 2
		
		const renderer = new THREE.WebGLRenderer()
		renderer.physicallyCorrectLights = true
		renderer.shadowMap.enabled = true
		renderer.outputEncoding = THREE.sRGBEncoding
		renderer.setSize(offsetWidth, offsetHeight)
		divScene.current.innerHTML = ''
		divScene.current.appendChild(renderer.domElement)
		
		const controls = new OrbitControls(camera, renderer.domElement)
		controls.enableDamping = true
		
		const loader = new GLTFLoader()
		loader.load(file, (gltf) => {
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
			gltf.scene.scale.set(.05, .05, .05)
			scene.add(gltf.scene)
		}, (xhr) => {
			console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`)
		}, (error) => {
			console.log(error)
		})
		
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
	}, [file]);
	return <div style={{borderRadius: 8, overflow: "hidden", width: "100%"}}>
		<Div ref={divScene}/>
	</div>
}

Screen3D.propTypes = {
	file: PropTypes.string.isRequired
};