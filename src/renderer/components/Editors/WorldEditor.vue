<template>
    <el-row :gutter="20">
        <el-col :span="18">
            <el-card>
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
            unit: 64,
            offset: {
                x: 0,
                y: 0
            },
            canvas: null
        }
    },
    props: {
        value: {
            required: true,
            type: Object
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

            if (current.hasOwnProperty("children")) {
                for (let child of current.children) {
                    this.parseEachObject(child)
                }
            }
        },
        drawGrid() {
            let ctx = this.canvas.getContext("2d")
            const width = ctx.canvas.width
            const height = ctx.canvas.height

            const x_count = Math.floor(width / this.unit)
            const y_count = Math.floor(height / this.unit)

            for (let i = 0; i < x_count; i++) {
                ctx.beginPath()
                ctx.moveTo(0, this.unit * i - 0.5)
                ctx.lineTo(width, this.unit * i - 0.5)
                ctx.strokeStyle = "#888"
                ctx.stroke()
            }

            for (let i = 0; i < y_count; i++) {
                ctx.beginPath()
                ctx.moveTo(this.unit * i, 0)
                ctx.lineTo(this.unit * i, height)
                ctx.strokeStyle = "#888"
                ctx.stroke()
            }
        }
    },
    watch: {
        value: {
            deep: true,
            handler(new_value) {
                this.objects_data = []
                this.parseEachObject(this.value)
                this.$emit("input", new_value)
            }
        }
    },
    computed: {
    },
    beforeMount() {
        this.parseEachObject(this.value)
    },
    mounted() {
        this.canvas = document.getElementById("canvas")
        this.drawGrid()
    }
}
</script>

<style scoped>
</style>
