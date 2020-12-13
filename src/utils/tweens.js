import * as TWEEN from "@tweenjs/tween.js";

export const scaleUpTween = (mesh, toValue, renderer, scene, camera) => {
    const tween = new TWEEN.default.Tween(mesh.scale)
        .to(toValue, 4000)
        .easing(TWEEN.default.Easing.Exponential.InOut)
        .onUpdate(() => {
            renderer.render(scene, camera);
        })
        .start();
};
