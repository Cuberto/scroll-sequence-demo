import SmoothScrollbar from 'smooth-scrollbar';
import ScrollTriggerPlugin from 'vendor/smooth-scrollbar/ScrollTriggerPlugin';
import SoftScrollPlugin from 'vendor/smooth-scrollbar/SoftScrollPlugin';
import gsap from "gsap";
import {preloadImages, calcDrawImage} from "utills";

// GSAP ScrollTrigger & Soft Edges plugin for SmoothScroll
SmoothScrollbar.use(ScrollTriggerPlugin, SoftScrollPlugin);

// Init smooth scrollbar
const view = document.getElementById('view-main');
const scrollbar = SmoothScrollbar.init(view, {
    renderByPixels: false,
    damping: 0.075
});

// Header out trigger animation
(function () {
    const container = document.querySelector('.cb-demo');
    const content = container.querySelector('.cb-demo-content');

    const tl = new gsap.timeline({
        scrollTrigger: {
            trigger: container,
            scrub: true,
            start: "bottom center"
        }
    });

    tl.to(content, {
        y: "50%",
        skewY: 3,
        duration: 1,
        ease: "none"
    }, 0);

    tl.to(content, {
        opacity: 0,
        duration: 0.5,
        ease: "none"
    }, 0);
})();

// Sequence trigger animation
(function () {

    // generate array of images paths. length = frames length, see: /src/assets/img
    const urls = new Array(162).fill(null).map((value, index) => `/img/${(index + 1)}.jpg`);

    // load images async
    const images = preloadImages(urls);

    const container = document.querySelector('.cb-sequence');
    const canvas = container.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    // create "scrub" ScrollTrigger effect with pin of main block
    // pinType: transform is required when use pin with smooth scrollbar
    const tl = new gsap.timeline({
        scrollTrigger: {
            trigger: container,
            scrub: true,
            start: "top top",
            end: "200%", // scene duration
            pin: true,
            pinType: "transform"
        }
    });

    // canvas resize handler
    window.addEventListener('resize', function resize() {
        ctx.canvas.width = document.documentElement.clientWidth;
        ctx.canvas.height = document.documentElement.clientHeight;
        return resize;
    }());

    // when all images ready
    images.then((imgs) => {
        const counter = {i: 0}; // iteration object

        tl.to(counter, {
            i: imgs.length - 1, // increment counter to frames length
            roundProps: "i", // round, only int
            ease: "none", // ease provided by smooth-scroll momentum
            immediateRender: true, // render first frame immediately
            onUpdate: () => calcDrawImage(ctx, imgs[counter.i]) // draw image in canvas when timeline update
        }, 0);

        // draw current frame again when scroll stopped and resize happened
        window.addEventListener('resize', () => calcDrawImage(ctx, imgs[counter.i]));
    });

})();
