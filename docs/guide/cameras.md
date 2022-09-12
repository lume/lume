# Cameras

There are different ways to control a scene's "camera".

A camera is an element that is placed somewhere inside a LUME scene, and its
position in that world determines from where we will view the scene, much like a
real camera in our real world.

# Perspective Camera

A perspective camera is very similar to a camera in the real world: it has a
view angle such that more things in the world are visible further away from the
camera.

In the following example, a `<lume-perspective-camera>` element is placed into
the scene, and we can control several aspects of the camera like the field of
view (fov), position, and rotation.

All cameras start "inactive". When a manually-created camera is not `active`
(i.e. it does not have an `active` attribute, or the attribute is set to
`active="false"`, or the `.active` property is set to `false`), then the scene
will use its internal default camera (see
[`Scene#camera`](../api/core/Scene#camera) for info on the default camera). Once
the perspective camera is active then the view will be displayed through the
lense of that camera, and we can manipulate that camera to control our view.

<div id="perspectiveCamera"></div>

# Camera Rig

The [`<lume-camera-rig>`](../api/cameras/CameraRig) element is much like a
real-life camera rig that contains a camera on it: it has controls to allow the
user to rotate and dolly the camera around in physical space more easily, in a
particular and specific. In the following example, try draging to rotate,
scrolling to zoom:

<div id="cameraRigExample"></div>

<script>
  new Vue({
    el: '#perspectiveCamera',
    template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
    data: { code: perspectiveCameraExample },
  })

  new Vue({
    el: '#cameraRigExample',
    template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
    data: { code: cameraRigExample },
  })
</script>

See the [`CameraRig`](../api/cameras/CameraRig) class for details on all of its
attributes and properties.
