<template>
    <el-row :gutter="20">
        <el-col :span="18">
            <el-card style="max-width: 1024px; max-height: 768px">
                <canvas id="canvas" width="1024" height="768"></canvas>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card>
                <div slot="header">
                    <h3>Properties</h3>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: "WorldEditor",
    data() {
        return {
            objects_data: [],
            scale: 1,
            offset: {
                x: 0,
                y: 0
            },
            camera: {
                x: 0,
                y: 0
            },
            canvas: null,
            background_color: "#000000FF"
        }
    },
    props: {
        value: {
            required: true,
            type: Object
        },
        screen_width: {
            default: 1024,
            type: Number
        },
        screen_height: {
            default: 768,
            type: Number
        }
    },
    methods: {
        parseEachObject(current) {
            if (current === null) {
                return
            }

            if (!current.hasOwnProperty("name") && !current.hasOwnProperty("world-name")) {
                return
            }

            if (!current.hasOwnProperty("world-name")) {
                this.objects_data.push(current)
            }
            else {
                this.offset.x = -Math.floor(current["camera"].x - 512)
                this.offset.y = -Math.floor(current["camera"].y - 384)
                this.camera = current["camera"]
                this.background_color = current["background-color"]
            }

            if (current.hasOwnProperty("children")) {
                for (let child of current.children) {
                    this.parseEachObject(child)
                }
            }
        },
        drawClean() {
            let ctx = this.canvas.getContext("2d")
            const width = ctx.canvas.width
            const height = ctx.canvas.height

            ctx.strokeStyle = this.background_color
            ctx.fillRect(0, 0, width, height)
        },
        drawText(font, text, color, pos) {
            let ctx = this.canvas.getContext("2d")
            const height = ctx.canvas.height

            ctx.textAlign = "center"
            ctx.font = font
            ctx.fillStyle = color
            ctx.fillText(text, pos.x + this.offset.x, this.offset.y + height - pos.y)
        },
        drawImage(filename, pos) {
            let ctx = this.canvas.getContext("2d")
            const height = ctx.canvas.height

            let img = new Image()
            img.src = this.$route.params.path + "/" + this.$route.params.name + "/resources/images" + filename
            img.onload = () => {
                ctx.drawImage(img, pos.x - img.width / 2, height - (pos.y - img.height / 2))
            }
        },
        drawEntity(entity) {
            if (entity.hasOwnProperty("components")) {
                const components = entity["components"]
                for (let com of components) {
                    if (com.type === "Label") {
                        this.drawText(com.size + 'px "微软雅黑"', com.text, "#FFFFFF", entity.position)
                    }
                    else if (com.type === "Sprite") {
                        this.drawImage(com.filename, entity.position)
                    }
                }
            }
        },
        draw() {
            if (this.canvas === null) {
                this.canvas = document.getElementById("canvas")
            }
            this.drawClean()

            for (let obj of this.objects_data) {
                this.drawEntity(obj)
            }
        }
    },
    watch: {
        value: {
            deep: true,
            handler(new_value) {
                this.objects_data = []
                this.parseEachObject(new_value)
                this.draw()
                this.$emit("input", new_value)
            }
        },
        offset: {
            deep: true,
            handler() {
                this.draw()
            }
        },
        scale: {
            handler() {
                this.draw()
            }
        },
        background_color: {
            handler() {
                this.draw()
            }
        }
    },
    beforeMount() {
        this.parseEachObject(this.value)
    },
    mounted() {
        this.draw()
    }
}
</script>

<style scoped>
</style>
