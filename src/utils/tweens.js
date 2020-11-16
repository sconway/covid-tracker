import * as TWEEN from "@tweenjs/tween.js";

export const scaleUpTween = (mesh, renderer, scene, camera) => {
    const tween = new TWEEN.default.Tween(mesh.scale)
        .to({ x: 1, y: 1, z: 1 }, 3000)
        .easing(TWEEN.default.Easing.Elastic.InOut)
        .onUpdate(() => {
            renderer.render(scene, camera);
        })
        .start();
};
