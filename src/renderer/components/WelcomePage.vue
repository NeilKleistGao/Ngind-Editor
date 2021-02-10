<template>
    <el-container>
        <el-aside>
            <el-row>
                <el-col>
                    <el-menu :default-active="current">
                        <el-menu-item index="1" @click="current = '1'">
                            <template slot="title">
                                <i class="el-icon-sunrise"></i>
                                <span>Welcome</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="2" @click="current = '2'">
                            <template slot="title">
                                <i class="el-icon-folder-add"></i>
                                <span>New Project</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="3" @click="current = '3'">
                            <template slot="title">
                                <i class="el-icon-folder-opened"></i>
                                <span>Open Project</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="4" @click="current = '4'">
                            <template slot="title">
                                <i class="el-icon-question"></i>
                                <span>Help</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="5" @click="current = '5'">
                            <template slot="title">
                                <i class="el-icon-setting"></i>
                                <span>Settings</span>
                            </template>
                        </el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>
        </el-aside>

        <el-main>
            <div v-if="current === '1'">
                <h1>Dogfight 3.2 Releases</h1>
                <h3>In this version, here are updates:</h3>

                <ul>
                    <li v-for="text of release_data" class="item text-muted">
                        {{text}}
                    </li>
                </ul>
            </div>
            <div v-else-if="current === '2'">
                <h1>Create New Project</h1>
                <el-form ref="form">
                    <el-form-item label="Project Name">
                        <el-input v-model="create_data.name"></el-input>
                    </el-form-item>
                    <el-form-item label="Path:">
                        <el-input v-model="create_data.path">
                            <el-button slot="append" @click="browseCreatePath">Browse</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="create">Create</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-else-if="current === '3'">
                <h1>Open Project</h1>
                <div v-if="recent_data === null">
                    <span>no recent project.</span>
                </div>
                <div v-else>
                    <el-table :data="recent_data">
                        <el-table-column prop="date" label="Last Modified"></el-table-column>
                        <el-table-column label="Release">
                            <template slot-scope="scope">
                                <el-link type="info" @click="open(scope.row.path, scope.row.title)">
                                    {{scope.row.title}}<small>({{scope.row.path + "/" + scope.row.title}})</small>
                                </el-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div v-else-if="current === '4'">
                <h1>Help</h1>
                <el-table :data="help_data">
                    <el-table-column label="Links">
                        <template slot-scope="scope">
                            <el-link type="info" :href="scope.row.link">
                                {{scope.row.title}}
                            </el-link>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-else>
                <h1>Settings</h1>
                <el-form ref="form">
                    <el-form-item label="Engine Path">
                        <el-input v-model="settings_data.engine_path">
                            <el-button slot="append" @click="browseEnginePath">Browse</el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-main>
    </el-container>
</template>

<script>
export default {
    name: "WelcomePage",
    data() {
        return {
            current: "1",
            release_data: [
                "Optimized memory pool algorithm;",
                "Fixed bugs when releasing resources;"
            ],
            create_data: {
                name: "",
                path: ""
            },
            recent_data: null,
            help_data: [
                {
                    "title": "Documentation",
                    "link": "https://ngind-doc.readthedocs.io/en/latest/?badge=latest"
                }
            ],
            settings_data: {
                engine_path: ""
            }
        };
    },
    methods: {
        create() {
            if (this.create_data.name !== "" && this.create_data.path !== "" && this.settings_data.engine_path !== "") {
                this.$router.push({name: 'main-page',
                    params: {
                        name: this.create_data.name,
                        path: this.create_data.path,
                        engine: this.settings_data.engine_path}})
            }
        },
        open(path, name) {
            this.$router.push({name: 'main-page',
                params: {
                    name: name,
                    path: path,
                    engine: null}})
        },
        browseCreatePath() {
            const remote = require('electron').remote
            const dialog = require('electron').remote.dialog
            this.create_data.path = dialog.showOpenDialog(remote.getCurrentWindow(), {
                properties: ['openDirectory']
            })[0]
        },
        browseEnginePath() {
            const remote = require('electron').remote
            const dialog = require('electron').remote.dialog
            this.settings_data.engine_path = dialog.showOpenDialog(remote.getCurrentWindow(), {
                properties: ['openDirectory']
            })
        }
    },
    watch: {
        "settings_data.engine_path"(new_value) {
            localStorage.setItem("engine-path", new_value)
        }
    },
    beforeMount() {
        this.settings_data.engine_path = localStorage.getItem("engine-path")
        if (this.settings_data.engine_path === "null") {
            this.settings_data.engine_path = ""
        }

        let recent = localStorage.getItem("recent")
        if (recent === "null" || recent === "" || recent === null) {
            recent = []
        }
        else {
            recent = recent.split('#')
        }

        this.recent_data = []
        for (let i = 0; i < recent.length; i++) {
            if (recent[i] !== "") {
                this.recent_data.push(JSON.parse(recent[i]))
            }
        }
    }
}
</script>

<style scoped>

</style>
