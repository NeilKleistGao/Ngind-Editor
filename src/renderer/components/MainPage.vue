<template>
    <el-container>
        <el-aside>
            <el-card>
                <h4 slot="header" class="clearfix">World: {{world_name}}</h4>
                <div>
                    <el-input placeholder="search..." v-model="tree_search_text"></el-input>
                    <el-divider></el-divider>
                    <el-tree :data="tree_data" :props="tree_prop" default-expand-all :filter-node-method="filterTreeNode">
                    </el-tree>
                </div>
            </el-card>
        </el-aside>
        <el-container>
            <el-main>
                <el-tabs type="border-card">
                    <el-tab-pane>
                        <span slot="label">
                            <i class="el-icon-picture-outline-round"></i>World
                        </span>
                        <i class="el-icon-loading"></i>
                    </el-tab-pane>
                    <el-tab-pane>
                        <span slot="label">
                            <i class="el-icon-video-camera-solid"></i>Animation
                        </span>
                        <i class="el-icon-loading"></i>
                    </el-tab-pane>
                    <el-tab-pane>
                        <span slot="label">
                            <i class="el-icon-crop"></i>Tile Map
                        </span>
                        <i class="el-icon-loading"></i>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>

export default {
    name: "MainPage",
    data() {
        return {
            world_name: "welcome",
            tree_search_text: "",
            tree_data: [{
                id: 0,
                label: "world"
            }],
            tree_prop: {
                children: "children",
                label: "label"
            }
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
                    label: "Animation",
                    submenu: [

                    ]
                },
                {
                    label: "TileMap",
                    submenu: [

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

        },
        filterTreeNode(value, data) {
            if (!value) {
                return true
            }

            return data.label.indexOf(value) !== -1
        }
    },
    mounted() {
        this.createMenu()
        this.createProject()
    }
}
</script>

<style scoped>

</style>
