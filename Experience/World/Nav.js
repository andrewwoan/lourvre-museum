class CharacterControllerComponent {
    decceleration;
    acceleration;
    velocity;

    controlAvatar;
    controlAvatarAnimationMixer;

    navMesh;
    up;
    down;
    positionVector;
    collisionVector;
    raycaster;
    intersects;
    positionOffset;
    currentPosition;
    newPosition;

    currentPoint;
    lastPoint;

    AssetsLoadComponent;
    InputComponent;
    CameraMovementComponent;

    get GetControlAvatar() {
        return this.controlAvatar;
    }

    // Get the camera object that belongs to the specific character instance
    get GetControlCamera() {
        for (let i = 0; i < this.controlAvatar.children.length; i++) {
            const childObject = this.controlAvatar.children[i];
            if (childObject.type === "PerspectiveCamera") {
                return childObject;
            }
        }
    }

    constructor(params) {
        this.Init(params);
    }

    Init(params) {
        this.decceleration = new THREE.Vector3(-5.0, -0.0001, -5.0);
        this.acceleration = new THREE.Vector3(5.0, 0, 5.0);
        this.velocity = new THREE.Vector3(0, 0, 0);

        this.up = new THREE.Vector3(0.0, 1.0, 0.0);
        this.down = new THREE.Vector3(0.0, -1.0, 0.0);
        this.positionVector = new THREE.Vector3(0, 0, 0);
        this.collisionVector = new THREE.Vector3(0, 0, 0);
        this.raycaster = new THREE.Raycaster(
            this.positionVector,
            this.down,
            0.0,
            10.0
        );
        this.currentPosition = new THREE.Vector3(0, 0, 0);
        this.positionOffset = new THREE.Vector3(0, 0, 0);
        this.newPosition = new THREE.Vector3(0, 0, 0);

        this.currentPoint = new THREE.Vector3();
        this.lastPoint = new THREE.Vector3();

        this.AssetsLoadComponent = params.AssetsLoadComponent;
        this.InputComponent = new InputComponent();
        this.CameraMovementComponent = new CameraMovementComponent(this);
    }

    // Calculate the character movement
    Update(timeInSecond) {
        if (
            !this.AssetsLoadComponent.GetAvatar ||
            !this.AssetsLoadComponent.GetNavMesh
        )
            return;

        if (this.controlAvatar === undefined)
            this.controlAvatar = this.AssetsLoadComponent.GetAvatar;
        if (this.stateMachine === undefined)
            this.stateMachine = this.AssetsLoadComponent.GetStateMachine;
        if (this.navMesh === undefined)
            this.navMesh = this.AssetsLoadComponent.GetNavMesh;

        // Update the Camera Movement to follow the character
        this.CameraMovementComponent.Update(timeInSecond);

        // Update the Animation Mixer
        if (this.controlAvatarAnimationMixer === undefined)
            this.controlAvatarAnimationMixer =
                this.AssetsLoadComponent.GetAnimationMixer;
        this.controlAvatarAnimationMixer.update(timeInSecond);

        // Update the StateMachine System
        this.stateMachine.Update(timeInSecond, this.InputComponent);

        const avatar = this.controlAvatar;

        //Calculate the character each frame position and Spawn a raycaster to detect the navMesh which determine the walkable areas on the enviroment
        avatar.getWorldPosition(this.positionVector);
        this.up.normalize();
        this.down.normalize();
        this.collisionVector
            .copy(this.positionVector)
            .add(this.up.multiplyScalar(0.1));
        this.raycaster.set(this.collisionVector, this.down);
        this.intersects = this.raycaster.intersectObject(this.navMesh, true);

        // Character is on the wallkable area
        if (this.intersects.length > 0) {
            // Character Movement Logic Calculation Below
            const velocity = this.velocity;
            const frameDecceleration = new THREE.Vector3(
                velocity.x * this.decceleration.x,
                velocity.y * this.decceleration.y,
                velocity.z * this.decceleration.z
            );
            frameDecceleration.multiplyScalar(timeInSecond);
            frameDecceleration.z =
                Math.sign(frameDecceleration.z) *
                Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z));

            velocity.add(frameDecceleration);

            // Running
            const acc = this.acceleration.clone();
            if (this.InputComponent.keys.shift) {
                acc.multiplyScalar(2.0);
            }

            // Walking
            if (this.InputComponent.keys.forward) {
                velocity.z += acc.z * timeInSecond;
            }
            if (this.InputComponent.keys.backward) {
                velocity.z -= acc.z * timeInSecond;
            }
            if (this.InputComponent.keys.left) {
                velocity.x += acc.x * timeInSecond;
            }
            if (this.InputComponent.keys.right) {
                velocity.x -= acc.x * timeInSecond;
            }

            const forward = new THREE.Vector3(0, 0, 1);
            forward.normalize();
            forward.multiplyScalar(velocity.z * timeInSecond);
            avatar.translateZ(forward.z);

            const sideways = new THREE.Vector3(1, 0, 0);
            sideways.normalize();
            sideways.multiplyScalar(velocity.x * timeInSecond);
            avatar.translateX(sideways.x);

            // change height when on stairs or slope
            const { point } = this.intersects[0];
            avatar.position.y = point.y + 0.03;

            // record the this current frame position
            this.positionOffset.copy(avatar.position);
            this.positionOffset.sub(this.currentPosition);
            this.currentPosition.copy(avatar.position);

            this.currentPoint = point;
        }
        // Character is not on the walkable area
        // then collision should occur and the character should move back to previous frame position otherwise will get stick on the current frame position
        else {
            console.log(avatar);
            if (this.currentPoint === this.lastPoint) return;
            console.log("occurs");
            this.newPosition = this.currentPosition.sub(this.positionOffset);
            avatar.position.lerp(this.currentPosition, timeInSecond * 0.01);
            this.lastPoint.copy(this.currentPoint);
        }
    }
}
