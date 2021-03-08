
// 重力
const G = -1140;
// 固定速度
const V = 1000;
// 开始位置
const START_POS = cc.v2(362, -125);

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
        this.node.on(cc.Node.EventType.TOUCH_START, this.fireArrow, this);
        // this.fire.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchStart, this);
        // this.ball.fixedRotation = true;
    },
    // called every frame
    update(dt) {
        if (this.ball && this.ball.linearVelocity && this.ball.linearVelocity.x) {
            // 计算夹角
            const angle = this.ball.linearVelocity.clone().signAngle(cc.v2(1, 0));
            this.ball.node.angle = -angle * 180 / Math.PI;
        }
    },
    getDelta(touch) {
        const location = this.ball.node.parent.convertToNodeSpaceAR(touch.getLocation());
        const s = location.x - START_POS.x;
        const h = location.y - START_POS.y;
        // a*t^2 + b*t + c = 0
        const a = G * this.ball.gravityScale * s / (2 * V * V);
        const b = 1;
        const c = a - h / s;
        const delta = b * b - 4 * a * c;
        if (delta >= 0) {
            const t1 = (-b + Math.sqrt(delta)) / (2 * a); // 平抛 tan 值
            const alpha1 = Math.atan(t1) + (s < 0 ? Math.PI : 0);

            const v_x_1 = Math.cos(alpha1) * V;
            const v_y_1 = Math.sin(alpha1) * V;
            return cc.v2(v_x_1, v_y_1)
        } else {
            return cc.v2(0, 0);
        }
    },
    fireArrow(touch) {
        const linearVelocity = this.getDelta(touch);
        if (linearVelocity.x) {
            this.ball.node.setPosition(START_POS);
            // this.ball.node.getComponentInChildren(cc.MotionStreak).reset();
            this.ball.linearVelocity = linearVelocity;
        }
    }
});
