import { TweakpaneUiPlugin } from "@threepipe/plugin-tweakpane"
import { BloomPlugin, DepthOfFieldPlugin, SSReflectionPlugin, TemporalAAPlugin } from "@threepipe/webgi-plugins"
import {
  _testFinish,
  _testStart,
  ContactShadowGroundPlugin,
  GBufferPlugin,
  LoadingScreenPlugin,
  ProgressivePlugin,
  SSAAPlugin,
  SSAOPlugin,
  ThreeViewer,
  Vector3
} from "threepipe"
async function init() {
  const viewer = new ThreeViewer({
    canvas: document.getElementById("mcanvas") as HTMLCanvasElement,
    renderScale: "auto",
    camera: {
      position: new Vector3(2, 2, 5)
    },
    msaa: !1,
    tonemap: !0,
    plugins: [LoadingScreenPlugin, ProgressivePlugin, SSAAPlugin]
  })
  await viewer.addPlugins([GBufferPlugin, SSAOPlugin, TemporalAAPlugin, BloomPlugin, SSReflectionPlugin, DepthOfFieldPlugin, ContactShadowGroundPlugin])
  console.log(viewer)
  const TweakpaneUi = viewer.addPluginSync(new TweakpaneUiPlugin(!0))
  await viewer.setEnvironmentMap("https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr", {
    setBackground: !0
  })
  const model = await viewer.load("https://webgi-demo.vercel.app/porsche.glb", {})
  const config = {
    carPaintHex: "#ff0000",
    wheelRimHex: "#000000"
  }
  model?.traverse((c: any) => {
    if (c.isMesh) {
      if (c.name === "collider") {
        c.visible = !1
      }
      if (c.material.name === "PAINT_COLOR_4") {
        config.carPaintHex = `#${c.material.color.getHexString()}`
        TweakpaneUi["_root"]
          ?.addInput(config, "carPaintHex", {
            label: "Paint Color 4"
          })
          .on("change", (h: any) => {
            c.material.color.set(h.value), viewer.setDirty()
          })
      }
      if (c.material.name === "CALIPE_COL_15") {
        config.wheelRimHex = `#${c.material.color.getHexString()}`
        TweakpaneUi["_root"]
          ?.addInput(config, "wheelRimHex", {
            label: "Wheel Rim Color"
          })
          .on("change", (h: any) => {
            c.material.color.set(h.value), viewer.setDirty()
          })
      }
    }
  })
  const ground = viewer.getPlugin(ContactShadowGroundPlugin)

  if (ground) {
    ground.yOffset = -0.21
    ground.size = 8
    ground.blurAmount = 1.25
    ground.material!.opacity = 0.9
    ground.material!.roughness = 1
    ground.material!.metalness = 0
  }

  const bloom = viewer.getPlugin(BloomPlugin)
  if (bloom) {
    bloom.pass!.threshold = 1.1
    bloom.pass!.intensity = 1
  }
  viewer.scene.envMapIntensity = 1
  const dof = viewer.getPlugin(DepthOfFieldPlugin)

  if (dof) {
    dof.pass!.depthRange = 1.8
    dof.pass!.nearBlurScale = 0.01
    dof.pass!.farBlurScale = 0.4
  }

  const ssr = viewer.getPlugin(SSReflectionPlugin)

  if (ssr) {
    ssr.pass!.intensity = 2
  }

  const ssao = viewer.getPlugin(SSAOPlugin)

  if (ssao) {
    ssao.enabled = !0
    //@ts-ignore
    ssao.intensity = 0.5
    //@ts-ignore
    ssao.bias = 0.001
    //@ts-ignore
    ssao.falloff = 1.25
    //@ts-ignore
    ssao.numSamples = 8
  }

  TweakpaneUi.setupPlugins(ContactShadowGroundPlugin),
    TweakpaneUi.setupPlugins(SSAAPlugin),
    TweakpaneUi.setupPlugins(SSReflectionPlugin),
    TweakpaneUi.setupPlugins(SSAOPlugin),
    TweakpaneUi.setupPlugins(BloomPlugin),
    TweakpaneUi.setupPlugins(DepthOfFieldPlugin),
    TweakpaneUi.appendChild(viewer.scene.uiConfig, {
      expanded: !0
    })
  console.log({
    result: model
  })
}

_testStart()

init().finally(_testFinish)
