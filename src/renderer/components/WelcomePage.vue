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
                <h1>Recent Releases</h1>
                <el-table :data="release_data">
                    <el-table-column prop="date" label="Date"></el-table-column>
                    <el-table-column label="Release">
                        <template slot-scope="scope">
                            <el-link type="info" :href="scope.row.link">
                                {{scope.row.title}}
                            </el-link>
                        </template>
                    </el-table-column>
                </el-table>
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
                                <el-link type="info">
                                    {{scope.row.title}}<small>({{scope.row.path}})</small>
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
                {
                    "date": "2021-01-21",
                    "title": "dogfight 3.1 release",
                    "link": "https://github.com/NeilKleistGao/NginD/releases/tag/v0.3.1"
                },
                {
                    "date": "2021-01-19",
                    "title": "dogfight 3.0 release",
                    "link": "https://github.com/NeilKleistGao/NginD/releases/tag/v0.3.0"
                }
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
            ]
        };
    },
    methods: {
        create() {
            if (this.name !== "" && this.path !== "") {
                this.$router.push({path: '/main', params: {project: this.path}})
            }
        },
        browseCreatePath() {
            const remote = require('electron').remote
            const dialog = require('electron').remote.dialog
            this.create_data.path = dialog.showOpenDialog(remote.getCurrentWindow(), {
                properties: ['openDirectory']
            })
        }
    }
}
</script>

<style scoped>

</style>
