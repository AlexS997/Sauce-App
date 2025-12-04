const lenis = new Lenis()

function raf(time){
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const frames = {
    currentIndex: 0,
    maxIndex: 342
}

let imagesLoad = 0
const images = []

const preloadImage = () => {
    for(var i = 1; i <= frames.maxIndex; i++){
        const imageUrl = `./images/${i.toString().padStart(3, "0")}_pic.jpeg`

        const img = new Image()
        img.src = imageUrl
        img.onload = () => {
            imagesLoad++

            if(i == 1){
                loadImage(0)
            }

            if(imagesLoad === frames.maxIndex){
                console.log("All Images Loaded")
                loadImage(frames.currentIndex)
                startAnimation()
            }
        }

        img.onerror = () => {
            console.log("Failed to Load: ", imageUrl)
        }

        images.push(img)
    }
}

const loadImage = (index) => {
    if(index >= 0 && index <= frames.maxIndex){
        const img = images[index]
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const scaleX = canvas.width / img.width
        const scaleY = canvas.height / img.height

        const scale = Math.min(scaleX, scaleY)

        const newWidth = img.width * scale
        const newHeight = img.height * scale

        const offsetX = (canvas.width - newWidth) / 2
        const offsetY = (canvas.height - newHeight) / 2

        context.clearRect(0, 0, canvas.width, canvas.height)
        context.imageSmoothingEnabled = true
        context.imageSmoothingQuality = "high"
        context.drawImage(img, offsetX, offsetY, newWidth, newHeight)

        frames.currentIndex = index
    }
}

const startAnimation = () => {
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".container",
            start: "top top",
            scrub: 2,
        }
    })

    tl.to(".canvasContainer", {
        top: -10,
    }, 'a')
    .to(frames, {
        currentIndex: frames.maxIndex,
        onUpdate: () => {
            loadImage(Math.floor(frames.currentIndex))
        }
    }, 'a')
}

preloadImage()