import * as TWEEN from "@tweenjs/tween.js";

export const scaleUpTween = (mesh, renderer, scene, camera) => {
    const tween = new TWEEN.default.Tween(mesh.scale)
        .to({ x: 1, y: 1, z: 1 }, 4000)
        .easing(TWEEN.default.Easing.Exponential.InOut)
        .onUpdate(() => {
            renderer.render(scene, camera);
        })
        .start();
};
