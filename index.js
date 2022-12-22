const { Extension, type, api } = require('clipcc-extension');

class MyExtension extends Extension {
    onInit() {
        const stage = getStageCanvas();
        api.addCategory({
            categoryId: 'em.pip.category',
            messageId: 'em.pip.category',
            color: '#66CCFF'
        });
        api.addBlock({
            opcode: 'em.pip.status',
            type: type.BlockType.REPORTER,
            messageId: 'em.pip.status',
            categoryId: 'em.pip.category',
            function: () => 'Hello, ClipCC!'
        });
        api.addBlock({
            opcode: 'em.pip.on',
            type: type.BlockType.COMMAND,
            messageId: 'em.pip.on',
            categoryId: 'em.pip.category',
            function: args => this.HelloWorld()
        });
    }
    onUninit() {
        api.removeCategory('em.pip.category');
    }
    start() {
        document.body.innerHTML += '<video id="video" width="300" height="150" autoplay muted></video>';
        const canvas = getStageCanvas();
        const video = document.getElementById('video');

        // Stream the canvas to the video element
        let stream;
        if (canvas.captureStream) {
            stream = canvas.captureStream();
        } else {
            stream = captureCanvas(canvas).start();
        }
        video.srcObject = stream;

        // Play the video
        video.play();
    }
    enablePictureInPicture(video) {
        // Check if Picture-in-Picture is supported
        if (document.pictureInPictureEnabled) {
            // Check if the video is already in Picture-in-Picture mode
            if (document.pictureInPictureElement !== video) {
                // Enter Picture-in-Picture mode
                video.requestPictureInPicture().catch(error => {
                    console.error(error);
                });
            }
        } else {
            console.error('Picture-in-Picture is not supported');
        }
    }
}

module.exports = MyExtension;
