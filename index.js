const { Extension, type, api } = require('clipcc-extension');
//yarn build
class MyExtension extends Extension {
    onInit() {
        api.addCategory({
            categoryId: 'em.pip.category',
            messageId: 'em.pip.category',
            color: '#ff8400'
        });
        api.addBlock({
            opcode: 'em.pip.status',
            type: type.BlockType.REPORTER,
            messageId: 'em.pip.status',
            categoryId: 'em.pip.category',
            function: () => this.stat()
        });
        api.addBlock({
            opcode: 'em.pip.available',
            type: type.BlockType.REPORTER,
            messageId: 'em.pip.available',
            categoryId: 'em.pip.category',
            function: args => this.available()
        });
        api.addBlock({
            opcode: 'em.pip.start',
            type: type.BlockType.COMMAND,
            messageId: 'em.pip.start',
            categoryId: 'em.pip.category',
            function: args => this.start()
        });
        api.addBlock({
            opcode: 'em.pip.on',
            type: type.BlockType.COMMAND,
            messageId: 'em.pip.on',
            categoryId: 'em.pip.category',
            function: args => this.enablePictureInPicture(video)
        });
        api.addBlock({
            opcode: 'em.pip.off',
            type: type.BlockType.COMMAND,
            messageId: 'em.pip.off',
            categoryId: 'em.pip.category',
            function: args => this.closePipWindow()
        });
    }
    onUninit() {
        api.removeCategory('em.pip.category');
    }
    stat() {
        if (document.pictureInPictureElement == video) return true; return false;
    }
    available() {
        if (document.pictureInPictureEnabled) return true; return false;
    }
    start() {
        console.log("starting");
        const newElement = document.createElement('div');

        // Set the element's content
        newElement.innerHTML = '<video id="video" width="480" height="360" autoplay muted style="display:none;"></video>';
        // Add the element to the top of the body
        document.body.prepend(newElement);
        const video = document.getElementById('video');
        const canvas = document.getElementsByTagName('canvas')[0];

        // Check if the element was found
        if (canvas) {
            // The element was found, do something with it
        } else {
            // The element was not found
            console.error('Could not find canvas element');
        }
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
    closePipWindow() {
        // Check if the current document is in a PIP window
        if (document.pictureInPictureElement) {
            // Exit Picture-in-Picture mode
            document.exitPictureInPicture().catch((error) => {
                console.error(error);
            });
        }
    }

    captureCanvas(canvas) {
        // Create a new MediaStream with a single video track
        const stream = new MediaStream();

        // Create a frame-by-frame update function
        function update() {
            // Get the current image data from the canvas
            const imageData = canvas.toDataURL('image/webp');

            // Create an image element from the image data
            const img = new Image();
            img.src = imageData;

            // Draw the image onto the canvas
            canvas.getContext('2d').drawImage(img, 0, 0);

            // Add the frame to the stream
            stream.addTrack(canvas.captureStream().getVideoTracks()[0]);

            // Schedule the next frame update
            requestAnimationFrame(update);
        }

        // Start updating the stream
        update();

        return stream;
    }
}

module.exports = MyExtension;
