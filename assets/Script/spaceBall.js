var _ = require('lodash');
// 重力
const Gravity = -624;

// 固定速度
// const V = 1000;

// 开始位置
const START_POS = cc.v2(392, -125);

// 星球排名
const STAR_RANKING = ['mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'uranus', 'neptune', 'pluto'];
const STAR_RANKING_MAP = {
    mercury: '水星',
    venus: '金星',
    earth: '地球',
    moon: '月球',
    mars: '火星',
    jupiter: '木星',
    uranus: '天王星',
    neptune: '海王星',
    pluto: '冥王星'
}

cc.Class({
    extends: cc.Component,
    properties: {
        spring: {
            default: null,
            type: cc.Node
        }
    },
    onLoad() {
        this.score = 0;
        this.probeResult = [];
        this.isSpringIncrease = false;

        window.Global = {
            handleProbe: this.handleProbe.bind(this),
        };
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, Gravity);
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
        this.spring = this.node.getChildByName('spring');
        this.brake = this.node.getChildByName('brake');
        this.ballContiner = this.node.getChildByName('ballContiner');
        this.springBoxCollider = this.spring.getComponent(cc.PhysicsPolygonCollider);
        this.ball = this.node.getChildByName('ball').getComponent(cc.RigidBody);
        this.initTouchable();
        this.initSchedule();
        this.initStarsSpin();
        this.updateStar();
    },
    handleProbe(node) {
        const isWinning = node.node.getComponent(cc.Sprite).enabled;
        if (isWinning) {
            this.score += 100;
            this.node.getChildByName('score').getComponent(cc.Label).string = `score: ${this.score}`
            this.updateStar();
        }
    },
    initStarsSpin() {
        const stars = this.node.getChildByName('stars')
        const comets = this.node.getChildByName('comets')
        const pins1 = this.node.getChildByName('pins').getChildByName('rotate1')
        const pins2 = this.node.getChildByName('pins').getChildByName('rotate2')
        const ground = this.node.getChildByName('ground')

        this.schedule(() => {
            if (stars.angle <= -360) {
                stars.angle = 0;
                comets.angle = 0;
                ground.angle = 0;
            }
            stars.angle -= 0.003;
            comets.angle -= 0.05;
            ground.angle -= 0.01;

            pins1.angle -= 0.05
            pins2.angle += 0.05
            _.forEach(pins1.children, pin => {
                if (pin.angle <= -360) {
                    pin.angle = 0;
                }
                pin.getComponent(cc.RigidBody).syncPosition(true)
            })
            _.forEach(pins2.children, pin => {
                if (pin.angle <= 360) {
                    pin.angle = 0;
                }
                pin.getComponent(cc.RigidBody).syncPosition(true)
            })
        }, 0.03);
    },
    initTouchable() {
        this.ballContiner.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.ballContiner.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    },
    initSchedule() {
        this.springSchedule = () => {

            if (this.spring.height <= 40) {
                this.spring.isSpringIncrease = true
            }
            if (this.spring.height >= 80) {
                this.spring.isSpringIncrease = false
            }
            if (this.spring.isSpringIncrease) {
                this.brake.y += 0.75;
                this.spring.height += 1.5;
                this.springBoxCollider.offset.y += 1.5;
            } else {
                this.brake.y -= 0.75;
                this.spring.height -= 1.5;
                this.springBoxCollider.offset.y -= 1.5;
            }
            this.brake.getComponent(cc.PhysicsBoxCollider).apply();
            this.springBoxCollider.apply();
        };
        const scrollBar = this.node.getChildByName('scrollBar').getChildByName('rolling')
        this.schedule(() => {
            if (scrollBar.width === 1055) {
                scrollBar.width = 1116;
            }
            scrollBar.width -= 1;
        }, 0.03);
    },
    getDelta(velocity) {
        const location = cc.v2(461, 400);
        const s = location.x - START_POS.x;
        const h = location.y - START_POS.y;
        const a = Gravity * this.ball.gravityScale * s / (2 * velocity * velocity);
        const b = 1;
        const c = a - h / s;
        const delta = b * b - 4 * a * c;
        if (delta >= 0) {
            const t1 = (-b + Math.sqrt(delta)) / (2 * a); // 平抛 tan 值
            const alpha1 = Math.atan(t1) + (s < 0 ? Math.PI : 0);
            const v_x_1 = Math.cos(alpha1) * velocity;
            const v_y_1 = Math.sin(alpha1) * velocity;
            return cc.v2(v_x_1, v_y_1)
        } else {
            return cc.v2(0, 0);
        }
    },
    updateStar() {
        const index = Math.min(Math.floor(this.score / 100), STAR_RANKING.length - 1);
        this.node.getChildByName('score').getChildByName('title').getComponent(cc.Label).string = STAR_RANKING_MAP[STAR_RANKING[index].toLowerCase()];
        cc.loader.loadRes(`ball/${STAR_RANKING[index]}`, cc.SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.log(err);
            }
            this.node.getChildByName('ball').getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    initReward() {
        this.probeResult = _.slice(_.shuffle(_.range(1, 12)), 0, _.random(1, 4));
        _.forEach(this.node.getChildByName('gates').children, (gate, index) => {
            gate.getChildByName('probe').getComponent(cc.Sprite).enabled = _.includes(this.probeResult, index);
        })
    },
    touchStart() {
        this.initReward();
        this.schedule(this.springSchedule, 0.03);
    },
    touchEnd() {
        const V = (100 - this.spring.height) * 25 + 600;
        this.unschedule(this.springSchedule);
        this.spring.height = 80;
        this.springBoxCollider.offset.y = 40;
        this.brake.y = -274;
        this.brake.getComponent(cc.PhysicsBoxCollider).apply();
        this.springBoxCollider.apply();
        const isLaunchArea = this.ball.node.x > 343.375 && this.ball.node.y < -226;
        if (isLaunchArea) {
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
