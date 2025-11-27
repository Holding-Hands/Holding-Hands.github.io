const { networkInterfaces } = require('os')
const { spawn } = require('child_process')

// 获取本机局域网 IP
function getLocalIP() {
  const nets = networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return 'localhost'
}

const ip = getLocalIP()

// 启动 Next.js dev server
const next = spawn('npx', ['next', 'dev', '--hostname', '0.0.0.0'], {
  stdio: ['inherit', 'pipe', 'inherit'],
  shell: true
})

// 替换 Next.js 输出中的 0.0.0.0 为实际 IP
next.stdout.on('data', (data) => {
  const output = data.toString().replace(/0\.0\.0\.0/g, ip)
  process.stdout.write(output)
})

next.on('error', (err) => {
  console.error('Failed to start server:', err)
})
