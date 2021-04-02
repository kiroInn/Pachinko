cc.Class({
    extends: cc.Component,

    start() {},

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.tag === 100) {
            Global.handleProbe(selfCollider)
        }
    }
});
