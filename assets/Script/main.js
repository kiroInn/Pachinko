// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    onLoad() {
        cc.loader.loadRes('prefab/spaceBall', cc.Prefab, (err, prefab) => {
            let node = cc.instantiate(prefab);
            node.parent = this.node;
            node.zIndex = 99;
            // store.gameLayer._racing = node.getComponent(Racing);
            // store.gameLayer._racing.show();
        });
    }
});
