<template>
    <el-container>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-card>
                        <el-select v-model="world_name" filterable>
                            <el-option v-for="w in worlds" :key="w" :label="w" :value="w"></el-option>
                        </el-select>
                        <el-divider></el-divider>
                        <div>
                            <el-input placeholder="search..." v-model="tree_search_text"></el-input>
                            <el-tree :data="tree_data" :props="tree_prop" default-expand-all :filter-node-method="filterTreeNode">
                            </el-tree>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="18">
                    <world-editor v-if="world_update_keys"
                                  ref="world"
                                  v-model="world_content"
                                  :screen_width="global_settings['window-width']"
                                  :screen_height="global_settings['window-height']">
                    </world-editor>
                </el-col>
            </el-row>
        </el-main>
        <el-dialog title="NginD" :visible.sync="waiting_dialog" width="30%" :show-close="false" :modal="true">
            <i class="el-icon-loading"></i><span>Loading...</span>
            <br/>
            <el-progress :percentage="progress"></el-progress>
        </el-dialog>
    </el-container>
</template>

<script>

import WorldEditor from "./Editors/WorldEditor";
export default {
    name: "MainPage",
    components: {WorldEditor},
    data() {
        return {
            world_name: "",
            tree_search_text: "",
            tree_data: [],
            tree_prop: {
                children: "children",
                label: "label"
            },
            waiting_dialog: false,
            progress: 0,
            engine_list: [],
            worlds: [],
            world_content: {},
            world_update_keys: 1,
            global_settings: {}
        }
    },
    methods: {
        createMenu() {
            const Menu = require('electron').remote.Menu

            const template = [
                {
                    label: "File",
                    submenu: [
                        {
                            label: "New Project",
                            accelerator: "ctrl+n",
                            click: () => {}
                        },
                        {
                            label: "Open Project",
                            accelerator: "ctrl+o",
                            click: () => {}
                        },
                        {
                            label: "Save",
                            accelerator: "ctrl+s",
                            click: () => {}
                        },
                        {
                            label: "Close",
                            click: () => {}
                        }
                    ]
                },
                {
                    label: "Edit",
                    submenu: [
                        {
                            label: "Undo",
                            accelerator: "ctrl+z",
                            click: () => {}
                        },
                        {
                            label: "Redo",
                            accelerator: "ctrl+shift+z",
                            click: () => {}
                        },
                        {
                            label: "Cut",
                            accelerator: "ctrl+x",
                            click: () => {}
                        },
                        {
                            label: "Copy",
                            accelerator: "ctrl+c",
                            click: () => {}
                        },
                        {
                            label: "Paste",
                            accelerator: "ctrl+v",
                            click: () => {}
                        },
                        {
                            label: "Delete",
                            accelerator: "delete",
                            click: () => {}
                        }
                    ]
                },
                {
                    label: "Resources",
                    submenu: [
                        {
                            label: "import",
                            submenu: [
                                {
                                    label: "Sprite",
                                    click: () => {}
                                },
                                {
                                    label: "Font",
                                    click: () => {}
                                },
                                {
                                    label: "Shader",
                                    click: () => {}
                                },
                                {
                                    label: "Music",
                                    click: () => {}
                                },
                                {
                                    label: "Effect",
                                    click: () => {}
                                }
                            ]
                        },
                        {
                            label: "Open Directory",
                            click: () => {}
                        },
                        {
                            label: "Settings",
                            click: () => {}
                        }
                    ]
                },
                {
                    label: "Worlds & Camera",
                    submenu: [
                        {
                            label: "Create New World",
                            accelerator: "ctrl+shift+c",
                            click: () => {}
                        },
                        {
                            label: "Camera Settings",
                            click: () => {}
                        },
                        {
                            label: "Worlds Settings",
                            click: () => {}
                        }
                    ]
                },
                {
                    label: "Components",
                    submenu: [
                        {
                            label: "Import Components",
                            accelerator: "ctrl+i",
                            click: () => {}
                        },
                        {
                            label: "Add Component",
                            accelerator: "ctrl+shift+a",
                            click: () => {}
                        }
                    ]
                },
                {
                    label: "Export",
                    submenu: [
                        {
                            label: "Export Settings",
                            click: () => {}
                        },
                        {
                            label: "Export",
                            accelerator: "ctrl+shift+e",
                            click: () => {}
                        }
                    ]
                },
                {
                    label: "Help",
                    submenu: [
                        {
                            label: "Documentation",
                            click: () => {}
                        },
                        {
                            label: "Tutorial",
                            click: () => {}
                        },
                        {
                            label: "About",
                            click: () => {}
                        },
                    ]
                }
            ]

            let menu = Menu.buildFromTemplate(template)
            Menu.setApplicationMenu(menu)
        },
        createProject() {
            const fs = require("fs")
            this.copyFilesPrepare(this.$route.params.engine,
                this.$route.params.path + "/" + this.$route.params.name)

            let total = 0
            for (let item of this.engine_list) {
                fs.copyFileSync(item.from, item.to)
                total++
                this.process = total / this.engine_list.length * 90
            }

            const cmake_path = this.$route.params.path +
                "/" + this.$route.params.name + "/CMakeLists.txt"
            let cmake = fs.readFileSync(cmake_path).toString()
            let reg = new RegExp("NginD", "g")
            cmake = cmake.replace(reg, this.$route.params.name)
            fs.writeFileSync(cmake_path, cmake)

            this.openProject()
        },
        updateRecent(title, path) {
            let recent = localStorage.getItem("recent")
            if (recent === "null" || recent === "" || recent === null) {
                recent = []
            }
            else {
                recent = recent.split('#')
            }

            let flag = -1
            for (let i = 0; i < recent.length; i++) {
                if (recent[i] !== "") {
                    let obj = JSON.parse(recent[i])
                    if (obj.title === title && obj.path === path) {
                        flag = i
                        break
                    }
                }
            }

            if (flag > -1) {
                recent.splice(flag, 1)
            }
            else if (recent.length === 10) {
                recent.pop()
            }

            let date = new Date()
            recent.push(JSON.stringify({
                date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
                title: title,
                path: path
            }))

            let final = ""
            for (let item of recent) {
                if (item !== "") {
                    final += item
                    final += '#'
                }
            }

            localStorage.setItem("recent", final)
        },
        openProject() {
            this.updateRecent(this.$route.params.name, this.$route.params.path)

            const fs = require('fs')
            const dir = fs.readdirSync(this.$route.params.path + "/" + this.$route.params.name + "/resources/config")
            for (const item of dir) {
                if (item.indexOf("world-") > -1) {
                    this.worlds.push(item.substr(6, item.length - 11))
                }
                else if (item === "global_settings.json") {
                    let settings = fs.readFileSync(this.$route.params.path + "/" + this.$route.params.name + "/resources/config/" + item)
                    this.global_settings = JSON.parse(settings.toString())
                }
            }

            this.progress = 100
            this.waiting_dialog = false

            if (this.worlds.length > 0) {
                this.world_name = this.worlds[0];
            }
        },
        copyFilesPrepare(from, to) {
            const fs = require("fs")
            fs.mkdirSync(to)

            const dir = fs.readdirSync(from)
            for (const item of dir) {
                if (item[0] === '.') {
                    continue
                }

                const f = from + "/" + item
                const t = to + "/" + item

                const state = fs.statSync(f)
                if (state.isDirectory()) {
                    this.copyFilesPrepare(f, t)
                }
                else {
                    this.engine_list.push({
                        from: f,
                        to: t
                    })
                }
            }
        },
        filterTreeNode(value, data) {
            if (!value) {
                return true
            }

            return data.label.indexOf(value) !== -1
        },
        parseTreeData(current, node) {
            if (node.hasOwnProperty("children")) {
                let i = 0
                for (let child of node["children"]) {
                    current["children"].push(
                        {
                            label: child["name"],
                            children: []
                        }
                    )
                    this.parseTreeData(current["children"][i], child)
                    i++
                }
            }
        }
    },
    mounted() {
        this.createMenu()
        this.waiting_dialog = true
        if (this.$route.params.engine !== null) {
            this.createProject()
        }
        else {
            this.openProject()
        }
    },
    watch: {
        world_name(new_value) {
            this.tree_data = [{
                label: "world",
                children: []
            }]

            const fs = require("fs")
            let content = fs.readFileSync(this.$route.params.path +
                "/" + this.$route.params.name +
                "/resources/config/world-" + new_value + ".json").toString()

            this.world_content = JSON.parse(content)
            this.$refs.world.$forceUpdate()
            this.parseTreeData(this.tree_data[0], this.world_content)
        }
    }
}
</script>

<style scoped>

</style>
