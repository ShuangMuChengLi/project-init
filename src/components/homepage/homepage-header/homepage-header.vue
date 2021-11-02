<template>
  <header class="main-header">
    <div class="logo-title">
      <img
        class="logo"
        src="../images/logo.png"
      >
      <span class="page-title">厦门110慧眼系统-实时监控</span>
    </div>
    <div class="menu-wrapper">
      <div class="menu-item active">
        <i class="app-icon" />
        <span>实战应用</span>
        <i class="el-icon-caret-bottom" />
      </div>
      <div class="menu-item">
        <i class="system-icon" />
        <span>系统管理</span>
        <i class="el-icon-caret-bottom" />
      </div>
    </div>
    <div class="user-wrapper">
      <img
        class="photo"
        src="../images/photo.png"
      >
      <span class="user-info-text">系统管理员，欢迎您！</span>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HomepageHeader'
};
</script>

<style scoped lang="less">
  @import "homepage-header";
</style>
