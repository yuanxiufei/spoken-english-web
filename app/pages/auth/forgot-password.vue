<template>
  <div class="container py-12">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-card p-8">
      <h1 class="text-2xl font-bold mb-2">找回密码</h1>
      <p class="text-gray-600 mb-6">输入你的邮箱地址，我们将发送重置密码链接。</p>
      <form @submit.prevent="submit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-700 mb-1">邮箱</label>
            <input v-model="email" type="email" required class="input" placeholder="you@example.com" />
          </div>
          <button type="submit" class="btn btn-primary w-full">发送重置链接</button>
        </div>
      </form>
      <div class="mt-6 text-center text-sm">
        已想起密码？
        <NuxtLink to="/auth/login" class="text-blue-600 hover:text-blue-500">返回登录</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const email = ref('')

const submit = async () => {
  // 这里可以接入真实接口
  alert(`重置链接已发送至：${email.value}`)
  navigateTo('/auth/login')
}
</script>