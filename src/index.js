import '@babel/polyfill'
import './styles.scss'
import snakeSprite from './Snake.png'

const WIDTH = 300
const HEIGHT = 300
const DPI_HEIGHT = HEIGHT
const DPI_WIDTH = WIDTH

const BLOCK_SIZE = 20
const BLOCKS_X = DPI_WIDTH / BLOCK_SIZE
const BLOCKS_Y = DPI_HEIGHT / BLOCK_SIZE

const FIELD = []
const EMPTY = ''
const FOOD = 'FOOD'
const SNAKE = 'SNAKE'
const SNAKE_BODY = 'SNAKE_BODY'
const DEFAULT_LENGTH = 2
const SPEED = 200

const snakeBody = []

const arrowUp = 'ArrowUp'
const arrowDown = 'ArrowDown'
const arrowRight = 'ArrowRight'
const arrowLeft = 'ArrowLeft'

let direction = arrowRight
let randomFood = true
let score = 0
let step = 1

let snakeY = 0
let snakeX = 0

let foodY = null
let foodX = null

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d')

canvas.style.height = HEIGHT + 'px'
canvas.style.width = WIDTH + 'px'

canvas.height = DPI_HEIGHT
canvas.width = DPI_WIDTH

const sprite = new Image()
sprite.src = snakeSprite

function clearCanvas() {
    ctx.clearRect(0, 0, DPI_HEIGHT, DPI_WIDTH)
}

function setupField() {
    for (let y = 0; y < BLOCKS_Y; y++) {
        FIELD[y] = []

        for (let x = 0; x < BLOCKS_X; x++) {
            FIELD[y].push(EMPTY)
        }
    }
}

function setupFood() {
    if(randomFood) {
        foodY = Math.floor( Math.random() * FIELD.length )
        foodX = Math.floor( Math.random() * FIELD[foodY].length )

        FIELD[foodX][foodY] = FOOD

        randomFood = false

        return
    }

    FIELD[foodX][foodY] = FOOD
}

function setupSnake() {
   FIELD[snakeY][snakeX] = SNAKE
}

function setupScore() {
    if (snakeX === foodY && snakeY === foodX) {
        score += 1
        randomFood = true
    }
}

function draw() {
    snakeBody.forEach(([x, y]) => FIELD[y][x] = SNAKE_BODY)

    for (let y = 0; y < FIELD.length; y++) {
        for (let x = 0; x < FIELD[y].length; x++) {
            drawImage(48, 48, x, y)

            switch (FIELD[y][x]) {
                case SNAKE :
                    drawSnakeHead()
                break

                case SNAKE_BODY:
                    for (const [i, current] of snakeBody.entries()) {
                        const prev = snakeBody[i - 1] || [snakeX, snakeY]
                        const next = snakeBody[i + 1] || []

                        const prevX = prev[0]
                        const prevY = prev[1]

                        const nextX = next[0]
                        const nextY = next[1]

                        const currentX = current[0]
                        const currentY = current[1]

                        const turn = drawSnakeTurn(prevX, currentX, nextX, prevY, currentY, nextY)

                        if (!turn) {
                            drawSnakeHorizon(prevX, currentX, nextX, prevY, currentY, nextY)
                            drawSnakeVertical(prevX, currentX, nextX, prevY, currentY, nextY)
                        }

                        if (!next.length) {
                            drawSnakeTail(prevX, currentX, prevY, currentY)
                        }
                    }
                break

                case FOOD :
                    drawImage(32, 48, x, y)
                break
            }

        }
    }
}

function setupSnakeBody() {
    snakeBody.unshift([snakeX, snakeY])
    snakeBody.splice(score + DEFAULT_LENGTH, snakeBody.length)
}

function render() {
    clearCanvas()

    setupField()
    setupFood()
    setupSnake()
    setupScore()

    draw()

    requestAnimationFrame(render)
}

render()

document.addEventListener('keydown', keyDown)

function drawSnakeTurn(prevX, currentX, nextX, prevY, currentY, nextY) {
    let twist = false

    if( prevX === BLOCKS_X - 1 &&
        currentX === 0 &&
        nextX === 0 &&
        prevY === 0 &&
        currentY === 0 &&
        nextY === BLOCKS_X - 1
        ||
        prevX === 0 &&
        currentX === 0 &&
        nextX === BLOCKS_X - 1 &&
        prevY === BLOCKS_X - 1 &&
        currentY === 0 &&
        nextY === 0
    ) {
        drawImage(48, 32, currentX, currentY)
    }
    else if (
        prevX === BLOCKS_X - 1 &&
        currentX === 0 &&
        nextX === 0 &&
        prevY === BLOCKS_X - 1 &&
        currentY === BLOCKS_X - 1 &&
        nextY === 0
        ||
        prevX === 0 &&
        currentX === 0 &&
        nextX === BLOCKS_X - 1 &&
        prevY === 0 &&
        currentY === BLOCKS_X - 1 &&
        nextY === BLOCKS_X - 1
    ) {
        drawImage(32, 32, currentX, currentY)
    }
    else if (
        prevX === 0 &&
        currentX === BLOCKS_X - 1 &&
        nextX === BLOCKS_X - 1 &&
        prevY === 0 &&
        currentY === 0 &&
        nextY === BLOCKS_X - 1
        ||
        prevX === BLOCKS_X - 1 &&
        currentX === BLOCKS_X - 1 &&
        nextX === 0 &&
        prevY === BLOCKS_X - 1 &&
        currentY === 0 &&
        nextY === 0
    ) {
        drawImage(0, 32, currentX, currentY)
    }
    else if (
        prevX === 0 &&
        currentX === BLOCKS_X - 1 &&
        nextX === BLOCKS_X - 1 &&
        prevY === BLOCKS_X - 1 &&
        currentY === BLOCKS_X - 1 &&
        nextY === 0
        ||
        prevX === BLOCKS_X - 1 &&
        currentX === BLOCKS_X - 1 &&
        nextX === 0 &&
        prevY === 0 &&
        currentY === BLOCKS_X - 1 &&
        nextY === BLOCKS_X - 1
    ) {
        drawImage(17, 32, currentX, currentY)
    }
    else if (
        prevX === BLOCKS_X - 1 &&
        currentX === 0 &&
        nextX === 0 &&
        prevY === currentY &&
        nextY < currentY &&
        nextY < prevY
        ||
        nextX === BLOCKS_X - 1 &&
        currentX === 0 &&
        prevX === 0 &&
        currentY === nextY &&
        prevY < currentY &&
        prevY < nextY
    ) {
        drawImage(48, 32, currentX, currentY)
    }
    else if (
        prevX === BLOCKS_X - 1 &&
        currentX === 0 &&
        nextX === 0 &&
        prevY === currentY &&
        nextY > currentY &&
        nextY > prevY
        ||
        nextX === BLOCKS_X - 1 &&
        currentX === 0 &&
        prevX === 0 &&
        currentY === nextY &&
        prevY > currentY &&
        prevY > nextY
    ) {
        drawImage(32, 32, currentX, currentY)
    }
    else if (
        prevX === 0 &&
        currentX === BLOCKS_X - 1 &&
        nextX === BLOCKS_X - 1 &&
        prevY === currentY &&
        nextY < currentY &&
        nextY < prevY
        ||
        nextX === 0 &&
        currentX === BLOCKS_X - 1 &&
        prevX === BLOCKS_X - 1 &&
        nextY === currentY &&
        prevY < currentY &&
        prevY < nextY
    ) {
        drawImage(0, 32, currentX, currentY)
    }
    else if (
        prevX === 0 &&
        currentX === BLOCKS_X - 1 &&
        nextX === BLOCKS_X - 1 &&
        prevY === currentY &&
        nextY > currentY &&
        nextY > prevY
        ||
        nextX === 0 &&
        currentX === BLOCKS_X - 1 &&
        prevX === BLOCKS_X - 1 &&
        nextY === currentY &&
        prevY > currentY &&
        prevY > nextY
    ) {
        drawImage(17, 32, currentX, currentY)
    }
    else if (
        prevX === currentX &&
        nextX < prevX &&
        nextX < currentX &&
        prevY === BLOCKS_Y - 1 &&
        currentY === 0 &&
        nextY === 0
        ||
        nextX === currentX &&
        prevX < nextX &&
        prevX < currentX &&
        prevY === 0 &&
        currentY === 0 &&
        nextY === BLOCKS_Y - 1
    ) {
        drawImage(48, 32, currentX, currentY)
    }
    else if (
        prevX === currentX &&
        nextX > prevX &&
        nextX > currentX &&
        prevY === BLOCKS_Y - 1 &&
        currentY === 0 &&
        nextY === 0
        ||
        nextX === currentX &&
        prevY === 0 &&
        currentY === 0 &&
        nextY === BLOCKS_Y - 1
    ) {
        drawImage(0, 32, currentX, currentY)
    }
    else if (
       currentX === nextX &&
       prevX < nextX &&
       prevX < currentX &&
       prevY === BLOCKS_Y - 1 &&
       currentY === BLOCKS_Y - 1 &&
       nextY === 0
       ||
       prevX === currentX &&
       nextX < prevX &&
       nextX < currentX &&
       prevY === 0 &&
       currentY === BLOCKS_Y - 1 &&
       nextY === BLOCKS_Y - 1
    ) {
        drawImage(32, 32, currentX, currentY)
    }
    else if (
        currentX === nextX &&
        prevX > nextX &&
        prevX > currentX &&
        prevY === BLOCKS_Y - 1 &&
        currentY === BLOCKS_Y - 1 &&
        nextY === 0
        ||
        prevX === currentX &&
        nextX > prevX &&
        nextX > currentX &&
        prevY === 0 &&
        nextY === BLOCKS_Y - 1 &&
        currentY === BLOCKS_Y - 1
    ) {
        drawImage(17, 32, currentX, currentY)
    }
    else if (prevX === currentX &&
        nextX > prevX &&
        nextX > currentX &&
        currentY === nextY &&
        prevY < currentY &&
        prevY < nextY
        ||
        nextX === currentX &&
        prevX > nextX &&
        prevX > currentX &&
        currentY === prevY &&
        nextY < currentY &&
        nextY < prevY
    ) {
        twist = true;
        drawImage(0, 32, currentX, currentY)
    }
    else if (
        currentX === nextX &&
        prevX > nextX &&
        prevX > currentX &&
        prevY === currentY &&
        nextY > currentY &&
        nextY > prevY
        ||
        prevX === currentX &&
        nextX > prevX &&
        nextX > currentX &&
        currentY === nextY &&
        prevY > currentY &&
        prevY > nextY
    ) {
        twist = true;
        drawImage(17, 32, currentX, currentY)
    }
    else if (
        prevX === currentX &&
        nextX < prevX &&
        nextX < currentX &&
        currentY === nextY &&
        prevY > currentY &&
        prevY > nextY
        ||
        currentX === nextX &&
        prevX < nextX &&
        prevX < currentX &&
        currentY === prevY &&
        nextY > currentY &&
        nextY > prevY
    ) {
        twist = true;
        drawImage(32, 32, currentX, currentY)
    }
    else if (
        currentX === nextX &&
        prevX < nextX &&
        prevX < currentX &&
        prevY === currentY &&
        nextY < currentY &&
        nextY < prevY
        ||
        prevX === currentX &&
        nextX < prevX &&
        nextX < currentX &&
        currentY === nextY &&
        prevY < currentY &&
        prevY < nextY
    ) {
        twist = true;
        drawImage(48, 32, currentX, currentY)
    }

    return twist
}

function drawSnakeVertical(prevX, currentX, nextX, prevY, currentY, nextY) {
    if (prevX === currentX &&
        prevX === nextX &&
        currentX === prevX &&
        currentX === nextX &&
        nextX === prevX &&
        nextX === currentX
    ) {
        drawImage(0, 48, currentX, currentY)
    }
}

function drawSnakeHorizon(prevX, currentX, nextX, prevY, currentY, nextY) {
    if(
        prevY === currentY &&
        prevY === nextY &&
        currentY === prevY &&
        currentY === nextY &&
        nextY === prevY &&
        nextY === currentY
    ) {
        drawImage(16, 48.2, currentX, currentY)
    }
}

function drawSnakeHead() {
    const T = 0
    const R = 1
    const D = 2
    const L = 3

    switch (direction) {

        case arrowUp:
            drawImage(16 * T, 0, snakeX, snakeY)
            break;

        case arrowDown:
            drawImage(16 * D, 0, snakeX, snakeY)
            break;

        case arrowLeft:
            drawImage(16 * L, 0, snakeX, snakeY)
            break;

        case arrowRight:
            drawImage(16 * R, 0, snakeX, snakeY)
            break;
    }


}

function drawSnakeTail(prevX, currentX, prevY, currentY) {

    if (prevX === 0 && currentX === BLOCKS_X - 1) {
        drawImage(16, 16, currentX, currentY)
    }
    else if (prevX === BLOCKS_X - 1 && currentX === 0) {
        drawImage(48, 16, currentX, currentY)
    }
    else if (prevY === BLOCKS_X - 1 && currentY === 0) {
        drawImage(0, 16, currentX, currentY)
    }
    else if (prevY === 0 && currentY === BLOCKS_X - 1) {
        drawImage(32, 16, currentX, currentY)
    }
    else if (prevX === currentX && prevY < currentY) {
        drawImage(0, 16, currentX, currentY)
    }
    else if (prevY === currentY && prevX > currentX) {
        drawImage(16, 16, currentX, currentY)
    }
    else if (prevX === currentX && prevY > currentY) {
        drawImage(32, 16, currentX, currentY)
    }
    else if ( prevY === currentY && prevX < currentX) {
        drawImage(48, 16, currentX, currentY)
    }
}

function drawImage(sx = 0, sy = 0, dx = 0, dy = 0) {
    ctx.drawImage(sprite, sx, sy, 16, 16, dx * BLOCK_SIZE, dy * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
}

function keyDown(e) {
    e.preventDefault();

    direction = moveDirection(e.code)

    setupSnakeBody()
    move(direction)

}

function moveDirection(current) {
    if(snakeBody.length < 2) {
        return current
    }

    const prev = direction

    if (current === arrowRight && prev === arrowLeft) {
        return arrowLeft
    }
    else if (current === arrowLeft && prev === arrowRight) {
        return arrowRight
    }
    else if (current === arrowUp && prev === arrowDown) {
        return arrowDown
    }
    else if (current === arrowDown && prev === arrowUp) {
        return arrowUp
    }

    return current
}

function move(str) {
    direction = str

    switch (str) {
        case arrowUp:
            if (snakeY === 0) {
                snakeY = BLOCKS_Y - 1
                return
            }
            snakeY -= step

            break;

        case arrowDown :
            if (snakeY === BLOCKS_Y - 1) {
                snakeY = 0
                return
            }
            snakeY += step

            break;

        case arrowLeft :
            if (snakeX === 0) {
                snakeX = BLOCKS_X - 1
                return
            }
            snakeX -= step

            break;

        case arrowRight :
            if (snakeX === BLOCKS_X - 1) {
                snakeX = 0
                return
            }
            snakeX += step

            break;
    }
}

setInterval(() => {

}, SPEED)