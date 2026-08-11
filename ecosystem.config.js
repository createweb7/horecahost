module.exports = {
  apps: [
    {
      name: "horecahost",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "800M",
      autorestart: true,
    },
  ],
};
