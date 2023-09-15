document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);

    // Enable fog in the scene
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2; // You can adjust the fog mode as needed
    scene.fogDensity = 0.005; // Adjust the density to control the strength of the fog
    scene.fogColor = new BABYLON.Color3(31 / 255, 31 / 255, 31 / 255); // Fog color (#1f1f1f in RGB)

    // Set the background color of the scene
    scene.clearColor = new BABYLON.Color3(31 / 255, 31 / 255, 31 / 255); // #1f1f1f in RGB

    // Create a camera and scale it down
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 15, 100), scene);
    var cameraTarget = new BABYLON.Vector3(0, 10, 0);
    camera.setTarget(cameraTarget);
    camera.inputs.clear(); // Disable camera input controls


     // Add a directional light with shadows
     var light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-10, -5, -10), scene);
     light.intensity = 5; // Light intensity
     light.position = new BABYLON.Vector3(20, 40, 10); // Light position
     light.shadowMinZ = 1; // Minimum shadow distance
     light.shadowMaxZ = 100; // Maximum shadow distance
 
     // Enable shadows for the light
     light.shadowEnabled = true;
 
     // Create a shadow generator for the model
     var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
     shadowGenerator.useBlurExponentialShadowMap = true; // Apply blur to the shadows
     shadowGenerator.blurKernel = 32; // Blur kernel size

     // Create a ground plane with the specified color and scale
    var ground = BABYLON.Mesh.CreateGround("ground", 200, 200, 200, scene);
    ground.receiveShadows = true; // Enable receiving shadows
    ground.position.y = 0; // Adjust the position to match the character's position
    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(31 / 255, 31 / 255, 31 / 255); // #1f1f1f in RGB
    ground.material = groundMaterial;

    scene.shadowsEnabled = true;

    // Use the GLTF loader to load the .glb model
    BABYLON.SceneLoader.Append("./model/", "YN.glb", scene, function (scene) {
        // Do something with the loaded model if needed
        // For example, you can position and scale it:
        var loadedModel = scene.meshes[0];
        loadedModel.position = new BABYLON.Vector3(0, 0, 0);
        loadedModel.scaling = new BABYLON.Vector3(1, 1, 1);
        

        // Set the default animation range to "idle" animation
        var idleAnimation = scene.animationGroups.find(group => group.name === "idle");
        if (idleAnimation) {
            idleAnimation.play(true);
        }

        // Create a flag to track if "wave" animation is currently playing
        var isWaveAnimationPlaying = false;

        // Function to play "wave" animation and transition back to "idle"
        function playWaveAnimation() {
            // Check if "wave" animation is not already playing
            if (!isWaveAnimationPlaying) {
                // Get the "wave" animation
                var waveAnimation = scene.animationGroups.find(group => group.name === "wave");
                if (waveAnimation) {
                    // Stop the "idle" animation (optional)
                    idleAnimation && idleAnimation.stop();

                    // Play "wave" animation once
                    waveAnimation.play(false);

                    // Listen for the end of the "wave" animation
                    waveAnimation.onAnimationEndObservable.addOnce(function () {
                        // When the "wave" animation finishes, return to "idle"
                        idleAnimation && idleAnimation.play(true);

                        // Set the flag to indicate that "wave" animation has finished
                        isWaveAnimationPlaying = false;
                    });

                    // Set the flag to indicate that "wave" animation is currently playing
                    isWaveAnimationPlaying = true;
                }
            }
        }

        // Add a click event listener to trigger the animation transition
        canvas.addEventListener("click", playWaveAnimation);
    });

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });
});

// Calculate and set the canvas height based on the desired aspect ratio
var canvas = document.getElementById("renderCanvas");
var aspectRatio = 4 / 3; // Example aspect ratio (adjust as needed)

function setCanvasHeight() {
    var newHeight = canvas.offsetWidth / aspectRatio;
    canvas.height = newHeight;
}

// Call the function initially and on window resize
setCanvasHeight();
window.addEventListener("resize", setCanvasHeight);
