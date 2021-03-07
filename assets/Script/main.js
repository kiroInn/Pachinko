
// 重力
const G = -1140;
// 固定速度
const V = 1000;
// 开始位置
const START_POS = cc.v2(-400, 20);

cc.Class({
    extends: cc.Component,

    properties: {
        // defaults, set visually when attaching this script to the Canvas
        ball1: {
            default: null,
            type: cc.RigidBody
        },
        fire: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, G);
        console.log(G, V, START_POS)
        this.ball = cc.find('Canvas/arrow').getComponent(cc.RigidBody);
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
        this.fire.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.fire.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchStart, this);
        // this.ball.fixedRotation = true;
    },

    // called every frame
    update(dt) {
        if (this.ball && this.ball.linearVelocity && this.ball.linearVelocity.x) {
            console.log(this.ball.linearVelocity)
            // 计算夹角
            const angle = this.ball.linearVelocity.clone().signAngle(cc.v2(1, 0));
            this.ball.node.angle = -angle * 180 / Math.PI;
        }
    },

    onTouchStart() {
  
        this.fireArrow()
    },
    fireArrow() {

        const linearVelocity = cc.v2(-48, 998);
        if (linearVelocity.x) {
            this.ball.node.setPosition(START_POS);
            // this.ball.node.getComponentInChildren(cc.MotionStreak).reset();
            this.ball.linearVelocity = linearVelocity;
        }
    }
});
