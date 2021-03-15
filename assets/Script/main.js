var _ = require('lodash');
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
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
        this.spring = cc.find('Canvas/spring');
        this.brake = cc.find('Canvas/brake');
        this.springBoxCollider = cc.find('Canvas/spring').getComponent(cc.PhysicsBoxCollider);
        this.ball = cc.find('Canvas/ball').getComponent(cc.RigidBody);
        this.ballContiner = cc.find('Canvas/ballContiner');
        this.ballContiner.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.ballContiner.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.initSchedule()
    },
    // called every frame
    update(dt) {
    },
    initSchedule() {
        this.springSchedule = () => {
            if (this.spring.height > 40) {
                this.brake.y -= 1;
                this.brake.getComponent(cc.PhysicsBoxCollider).apply();
                this.spring.height -= 2;
                this.springBoxCollider.offset.y -= 2;
                this.springBoxCollider.apply();
            }
        };
        const scrollBar = cc.find('Canvas/scrollBar/rolling')
        this.schedule(() => {
            if (scrollBar.width === 1050) {
                scrollBar.width = 1200;
            }
            scrollBar.width -= 1;
        }, 0.03);
    },
    getDelta(V) {
        const location = cc.v2(391, 400);
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
    initReward() {
        const result = _.slice(_.shuffle(_.range(1, 12)), 0, _.random(1, 4));
        _.forEach(cc.find('Canvas/gates').children, (gate, index) => {
            gate.getChildByName('probe').getComponent(cc.Sprite).enabled = _.includes(result, index);
        })
    },
    touchStart() {
        this.initReward();
        this.schedule(this.springSchedule, 0.03);
    },
    touchEnd() {
        const V = (100 - this.spring.height) * 20 + 600;
        this.unschedule(this.springSchedule);
        this.spring.height = 80;
        this.springBoxCollider.offset.y = 40;
        this.brake.y = -274;
        this.brake.getComponent(cc.PhysicsBoxCollider).apply();
        this.springBoxCollider.apply();
        if (this.ball.node.x > 343.375) {
            this.fireArrow(V)
        }
    },
    fireArrow(V) {
        const linearVelocity = this.getDelta(V);
        if (linearVelocity.x) {
            this.ball.node.setPosition(START_POS);
            this.ball.linearVelocity = linearVelocity;
        }
    }
});
