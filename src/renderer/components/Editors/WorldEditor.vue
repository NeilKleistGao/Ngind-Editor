<template>
    <el-container>
        <div>

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
                x: 0,
                y: 0
            }
        }
    },
    props: {
        world_json: {
            required: true,
            type: Object
        }
    },
    methods: {
        parseEachObject(current) {
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
        }
    },
    beforeMount() {
        this.parseEachObject(this.world_json)
    }
}
</script>

<style scoped>

</style>
