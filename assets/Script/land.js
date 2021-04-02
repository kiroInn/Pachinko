cc.Class({
    extends: cc.Component,

    properties: {},

    start() { },

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.tag === 100) {
            otherCollider.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(200, -100);

        }
    }
});
