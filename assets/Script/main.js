
// 重力
const G = -1024;
// 固定速度
// const V = 1000;
// 开始位置
const START_POS = cc.v2(392, -125);

cc.Class({
    extends: cc.Component,

    properties: {
        spring: {
            default: null,
            type: cc.Node
        }
    },
    // use this for initialization
    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, G);
        this.spring = cc.find('Canvas/spring');
        this.springBoxCollider = cc.find('Canvas/spring').getComponent(cc.PhysicsBoxCollider);
        console.log(this.springBoxCollider.size)
        this.ball = cc.find('Canvas/ball').getComponent(cc.RigidBody);
        cc.director.getPhysicsManager().debugDrawFlags = 1;
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        console.log(cc.find('Canvas/land').getComponent(cc.RigidBody))
        cc.find('Canvas/land').getComponent(cc.RigidBody).applyForceToCenter(cc.v2(77, 77));
        this.initScrollBar()
    },
    // called every frame
    update(dt) {
    },
    initScrollBar() {
        this.scrollBar = cc.find('Canvas/scrollBar/rolling')
        console.log(this.scrollBar);
        this.schedule(() => {
            if (this.scrollBar.width === 1050) {
                this.scrollBar.width = 1200;
            }
            this.scrollBar.width -= 1;
        }, 0.03);
    },
    getDelta(V) {
        const location = cc.v2(391, 100);
        const s = location.x - START_POS.x;
        const h = location.y - START_POS.y;
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
    touchStart() {
        this.schedule(() => {
            if (this.spring.height > 50) {
                this.spring.height -= 2;
                this.springBoxCollider.offset.y -= 2;
                this.springBoxCollider.apply();
            }
        }, 0.03);
    },
    touchEnd() {
        const V = (100 - this.spring.height) * 20 + 600;
        this.unscheduleAllCallbacks();
        console.log(this.springBoxCollider, this.springBoxCollider.size.height)
        this.spring.height = 100;
        this.springBoxCollider.offset.y = 50;
        this.springBoxCollider.apply();
        this.fireArrow(V)
    },
    fireArrow(V) {
        const linearVelocity = this.getDelta(V);
        if (linearVelocity.x) {
            this.ball.node.setPosition(START_POS);
            this.ball.linearVelocity = linearVelocity;
        }
    }
});
