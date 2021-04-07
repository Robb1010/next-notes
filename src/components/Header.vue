<template> 
    <div>
        <el-header class="header-container" height="70px"> 
            <el-container class="header">
                <h2>nextContaier</h2>
                <el-button type="primary" class="logout-btn">Logout</el-button>
            </el-container>
        </el-header>
    </div>
</template>

<script>
export default {
    name: "Header"
}
</script>

<style scoped>
    .header-container {
        border-bottom: solid;
        border-color: #DCDFE6;
        border-width: 1px;
        border-radius: 0px;
        
    }
    .header {
        align-items: center;
        justify-content: space-between;
    }
    .logout-btn {
        height: 40px;
    }
</style>