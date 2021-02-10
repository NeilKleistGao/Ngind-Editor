<template>
    <el-container>
        <div class="grid-background" :style="getBackgroundStyle">
            <div v-for="obj in objects_data" :key="obj.name" :style="getObjectStyle(obj.position)">
                <el-tag>{{obj.name}}</el-tag>
            </div>
        </div>
    </el-container>
</template>

<script>
export default {
    name: "WorldEditor",
    data() {
        return {
            objects_data: [],
            scale: 1,
            offset: {
                x: 52,
                y: 48
            }
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
        getObjectStyle(position) {
            return "position: relative; left: " + position.x + "; top: " + position.y + ";"
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
        getBackgroundStyle() {
            return "background-position: " + this.offset.x + "px, " + this.offset.y + "px;"
        }
    },
    beforeMount() {
        this.parseEachObject(this.value)
    }
}
</script>

<style scoped>
.grid-background {
    width: 84vw;
    height: 84vh;
    background-image:-webkit-linear-gradient(top, transparent 60px, rgba(145,145,145, 200) 64px),
                    -webkit-linear-gradient(left, transparent 60px, rgba(145,145,145, 200) 64px);
    background-size: 64px 64px;
}
</style>
