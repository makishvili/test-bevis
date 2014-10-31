modules.require(
    ['block','d3'],
    function (Block) {

        Block.initDomTree(document.body).done(function () {
            console.log("start")
        });
    });
