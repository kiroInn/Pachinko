cc.Class({
    extends: cc.Component,
    onLoad() {
        cc.loader.loadRes('prefab/spaceBall', cc.Prefab, (err, prefab) => {
            let node = cc.instantiate(prefab);
            node.parent = this.node;
            node.zIndex = 99;
        });
    }
});
